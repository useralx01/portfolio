(()=>{'use strict';
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
 const nav=$('.nav'),navBtn=$('.nav-btn');
 if(nav&&navBtn){
  const close=()=>{nav.classList.remove('open');navBtn.setAttribute('aria-expanded','false')};
  navBtn.addEventListener('click',()=>{const show=nav.classList.toggle('open');navBtn.setAttribute('aria-expanded',show?'true':'false')});
  $$('.nav a').forEach(a=>a.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  document.addEventListener('pointerdown',e=>{if(!nav.contains(e.target)&&!navBtn.contains(e.target))close()});
 }
 const progress=$('.scroll-progress');
 if(progress){
  let pending=false;
  const draw=()=>{const total=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(total>0?Math.max(0,Math.min(1,scrollY/total)):0)+')';pending=false};
  draw();addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(draw)}},{passive:true});addEventListener('resize',draw);
 }
 const dataNode=$('#project-data'),hero=$('.hero'),tabs=$$('.switch-tab'),heroStage=$('.hero-display');
 if(hero&&dataNode&&tabs.length){
  let projects=[];try{projects=JSON.parse(dataNode.textContent)}catch(e){console.error('Invalid project data',e)}
  const curr={index:0};
  const title=$('[data-hero-title]'),desc=$('[data-hero-description]'),detail=$('[data-hero-detail]'),category=$('[data-hero-category]'),counter=$('[data-hero-counter]'),link=$('[data-hero-link]'),logo=$('[data-hero-logo]'),chain=$('[data-hero-chain]'),im=$('[data-hero-image]'),vid=$('[data-hero-video]'),label=$('[data-hero-screenlabel]'),toplabel=$('[data-hero-toplabel]');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dataSaver=!!(navigator.connection&&navigator.connection.saveData);
  function setIndex(i){
   if(!projects.length)return;
   const len=projects.length;
   curr.index=(i+len)%len;
   const p=projects[curr.index];
   if(!p)return;
   if(heroStage)heroStage.style.opacity='.48';
   if(title)title.textContent=p.name;
   if(desc)desc.textContent=p.subtitle;
   if(detail)detail.textContent=p.description;
   if(category)category.textContent=p.category;
   if(counter)counter.textContent=String(curr.index+1).padStart(2,'0')+' / '+String(len).padStart(2,'0');
   if(link){link.href=p.href;link.setAttribute('aria-label','Explore '+p.name)}
   if(toplabel)toplabel.textContent=p.category;
   if(label)label.textContent=p.mediaLabel||'ACTUAL PROJECT MATERIAL';
   if(logo){
    if(p.logo){logo.src=p.logo;logo.alt=p.name+' logo';logo.hidden=false}
    else{logo.removeAttribute('src');logo.hidden=true}
   }
   if(chain){
    if(p.logo){chain.src=p.logo;chain.alt='';chain.hidden=false}
    else{chain.removeAttribute('src');chain.hidden=true}
   }
   if(vid){
    vid.pause();
    vid.removeAttribute('src');
    vid.removeAttribute('poster');
    vid.load();
   }
   if(p.video){
    if(im)im.hidden=true;
    if(vid){
     vid.poster=p.poster||p.image||'';
     vid.src=p.video;
     vid.hidden=false;
     vid.load();
     if(!reduced&&!dataSaver){
      const pr=vid.play();
      if(pr&&typeof pr.catch==='function')pr.catch(()=>{});
     }
    }
   }else{
    if(vid)vid.hidden=true;
    if(im){im.src=p.image||'';im.alt=p.mediaLabel||p.name+' original project screenshot';im.hidden=false;im.classList.toggle('artistic',!!p.logo&&p.name==='Lumen')}
   }
   tabs.forEach((t,j)=>{const chosen=j===curr.index;t.classList.toggle('active',chosen);t.setAttribute('aria-pressed',chosen?'true':'false');t.tabIndex=chosen?0:-1});
   const delay=reduced?0:100;
   setTimeout(()=>{if(heroStage)heroStage.style.opacity='1'},delay);
  }
  tabs.forEach((t,j)=>t.addEventListener('click',()=>setIndex(j)));
  tabs.forEach((t,j)=>t.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();let k=j+(e.key==='ArrowRight'?1:-1);k=(k+tabs.length)%tabs.length;tabs[k].focus();setIndex(k)}}));
  setIndex(0);
  if(heroStage)heroStage.style.transition='opacity .32s ease,transform .6s cubic-bezier(.2,.8,.2,1)';
 }
 const search=$('.archive-search'),buttons=$$('.archive-controls button'),rows=$$('.archive-row'),empty=$('.archive-empty'),preview=$('.archive-side');
 if(rows.length){
  let cat='all';
  const previewImage=$('[data-preview-image]'),previewName=$('[data-preview-name]'),previewDesc=$('[data-preview-description]'),previewBlank=$('[data-preview-blank]'),previewCat=$('[data-preview-category]'),previewLink=$('[data-preview-link]');
  let active=null;
  function focusPreview(row){
   if(!row||!preview)return;
   active=row;
   rows.forEach(r=>r.classList.toggle('active',r===row));
   const src=row.dataset.image||'';
   if(previewImage){
    if(src){previewImage.src=src;previewImage.alt=row.dataset.name+' original project visual';previewImage.hidden=false;if(previewBlank)previewBlank.hidden=true}
    else{previewImage.hidden=true;if(previewBlank){previewBlank.hidden=false;previewBlank.textContent=row.dataset.name||"Project"}}
   }
   if(previewName)previewName.textContent=row.dataset.name||'';
   if(previewDesc)previewDesc.textContent=row.dataset.desc||'';
   if(previewCat)previewCat.textContent=row.dataset.category||'';
   if(previewLink)previewLink.href=row.getAttribute('href')||'#';
  }
  function update(){
   const q=(search?.value||'').trim().toLowerCase();
   let first=null,n=0;
   rows.forEach(row=>{
    const ok=(cat==='all'||row.dataset.category.toLowerCase()===cat)&&(!q||(row.dataset.search||'').includes(q));
    row.hidden=!ok;
    if(ok){n++;if(!first)first=row}
   });
   if(empty)empty.hidden=n!==0;
   if(n===0){rows.forEach(r=>r.classList.remove('active'));if(previewName)previewName.textContent='No matching projects';if(previewImage)previewImage.hidden=true;if(previewBlank){previewBlank.hidden=false;previewBlank.textContent=row.dataset.name||"Project"}}
   else if(!active||active.hidden)focusPreview(first);
  }
  rows.forEach(row=>{row.addEventListener('pointerenter',()=>focusPreview(row));row.addEventListener('focus',()=>focusPreview(row))});
  buttons.forEach(b=>b.addEventListener('click',()=>{cat=b.dataset.filter||'all';buttons.forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b?'true':'false')});update()}));
  search?.addEventListener('input',update);
  update();
 }
 const videos=$$('video:not([data-hero-video])');
 videos.forEach(vid=>vid.addEventListener('play',()=>videos.forEach(other=>{if(other!==vid)other.pause()})));
 const modal=$('.lightbox');
 if(modal&&typeof modal.showModal==='function'){
  $$('a[data-lightbox]').forEach(a=>a.addEventListener('click',e=>{
   e.preventDefault();
   const im=$('img',modal),src=a.getAttribute('href');
   if(im&&src){im.src=src;im.alt=$('img',a)?.alt||'Project screenshot';modal.showModal()}
  }));
  $('button',modal)?.addEventListener('click',()=>modal.close());
  modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});
 }
 const toc=$$('.case-toc a');
 if(toc.length){
  const sections=toc.map(a=>$(a.getAttribute('href'))).filter(Boolean);
  if('IntersectionObserver' in window){
   const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){toc.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}})
   },{rootMargin:'-10% 0px -63% 0px',threshold:.06});
   sections.forEach(s=>obs.observe(s));
  }
 }
})();