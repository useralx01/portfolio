// Small behaviour only: mobile menu, reveal on scroll, video play when visible, work list pane, toc highlight.
(()=>{
const d=document,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
// light / dark toggle. The first visit follows the system; the choice is only saved when the button is pressed.
const tg=d.getElementById('tgl'),root=d.documentElement,mq=matchMedia('(prefers-color-scheme:dark)');
const paint=()=>{const dk=root.getAttribute('data-theme')==='dark';
 if(tg){const l=dk?tg.dataset.toLight:tg.dataset.toDark;tg.setAttribute('aria-label',l);tg.title=l}
 const m=d.querySelector('meta[name=theme-color]');if(m)m.content=dk?'#0f1012':'#f6f6f4'};
const setTheme=(t,save)=>{root.setAttribute('data-theme',t);if(save){try{localStorage.setItem('theme',t)}catch(e){}}paint()};
if(tg)tg.addEventListener('click',()=>setTheme(root.getAttribute('data-theme')==='dark'?'light':'dark',true));
let saved=null;try{saved=localStorage.getItem('theme')}catch(e){}
if(saved!=='dark'&&saved!=='light'&&mq.addEventListener)mq.addEventListener('change',e=>setTheme(e.matches?'dark':'light',false));
paint();
const mb=d.querySelector('.mbtn'),mn=d.querySelector('.mnu');
if(mb&&mn){
 const shut=()=>{mn.classList.remove('on');mb.setAttribute('aria-expanded','false');mb.textContent=mb.dataset.open;d.documentElement.classList.remove('lock')};
 mb.addEventListener('click',()=>{const on=mn.classList.toggle('on');mb.setAttribute('aria-expanded',on);mb.textContent=on?mb.dataset.close:mb.dataset.open;d.documentElement.classList.toggle('lock',on)});
 mn.addEventListener('click',e=>{if(e.target.closest('a'))shut()});
 addEventListener('resize',()=>{if(innerWidth>860)shut()});
}
// reveal on scroll
const rv=[...d.querySelectorAll('.rv')];
if('IntersectionObserver' in window&&!RM){
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -6% 0px'});
 rv.forEach(e=>io.observe(e));
}else rv.forEach(e=>e.classList.add('in'));
// videos: load and play when visible, pause when away
const vids=[...d.querySelectorAll('video[data-src]:not([data-pane])')];
const vio=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){if(!v.getAttribute('src'))v.src=v.dataset.src;if(!RM)v.play().catch(()=>{})}else v.pause()}),{threshold:.25});
vids.forEach(v=>vio.observe(v));
// work list: hover or focus swaps the media pane (desktop)
const rows=[...d.querySelectorAll('.rows .row')],pane=d.querySelector('.pane');
if(rows.length&&pane){
 const items=[...pane.querySelectorAll('.film>[data-i]')],meta=pane.querySelector('.meta'),link=pane;
 const set=i=>{
  rows.forEach((r,j)=>r.classList.toggle('on',j===i));
  items.forEach(it=>{const on=+it.dataset.i===i;it.classList.toggle('on',on);
   if(it.tagName==='VIDEO'){if(on){if(!it.getAttribute('src'))it.src=it.dataset.src;if(!RM)it.play().catch(()=>{})}else it.pause()}});
  const r=rows[i];meta.querySelector('b').textContent=r.dataset.name;meta.querySelector('span').textContent=r.dataset.kind;link.href=r.href;
 };
 rows.forEach((r,i)=>{r.addEventListener('mouseenter',()=>set(i));r.addEventListener('focus',()=>set(i))});
 set(0);
}
// legal page contents list follows the reader
const L=[...d.querySelectorAll('.toc a')];
if(L.length){
 const H=L.map(a=>d.getElementById(a.hash.slice(1)));
 const on=()=>{let k=0;H.forEach((h,i)=>{if(h&&h.getBoundingClientRect().top<innerHeight*.35)k=i});L.forEach((a,i)=>a.classList.toggle('on',i===k))};
 addEventListener('scroll',on,{passive:true});on();
}
})();
