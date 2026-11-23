// Small behaviour only: mobile menu, reveal on scroll, video play when visible, work list pane, toc highlight.
(()=>{
const d=document,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
// light / dark toggle. The first visit is light; the choice is saved when the button is pressed.
const tg=d.getElementById('tgl'),root=d.documentElement,mq=matchMedia('(prefers-color-scheme:dark)');
const paint=()=>{const dk=root.getAttribute('data-theme')==='dark';
 if(tg){const l=dk?tg.dataset.toLight:tg.dataset.toDark;tg.setAttribute('aria-label',l);tg.title=l}
 const m=d.querySelector('meta[name=theme-color]');if(m)m.content=dk?'#0f1012':'#f6f6f4'};
const setTheme=(t,save)=>{root.setAttribute('data-theme',t);if(save){try{localStorage.setItem('theme',t)}catch(e){}}paint()};
if(tg)tg.addEventListener('click',()=>setTheme(root.getAttribute('data-theme')==='dark'?'light':'dark',true));
let saved=null;try{saved=localStorage.getItem('theme')}catch(e){}
// the site opens light (Licht, 23 Nov); it no longer follows the system theme
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
const vio=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){if(!v.getAttribute('src'))v.src=v.dataset.src;if(!RM)v.play().catch(()=>{})}else v.pause()}),{threshold:.01,rootMargin:'40% 0px 40% 0px'});
vids.forEach(v=>vio.observe(v));

// ---- home: scenes, statement, steps, header, smooth wheel ----
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),ss=t=>t*t*(3-2*t);
const scenes=[...d.querySelectorAll('.scene')].map(el=>({el,stage:el.querySelector('.stage'),film:el.querySelector('.film'),slot:el.querySelector('.slot'),cap:el.querySelector('.cap'),fades:[...el.querySelectorAll('[data-fade]')]}));
const say=d.querySelector('.say .big'),sayEl=d.querySelector('.say'),how=d.querySelector('.how'),steps=how?[...how.querySelectorAll('ol li')]:[];
let words=[];
if(say){const txt=say.textContent.trim().split(/\s+/);say.setAttribute('aria-label',txt.join(' '));say.textContent='';
 txt.forEach((w,i)=>{const s=d.createElement('span');s.className='w';s.setAttribute('aria-hidden','true');s.textContent=w+(i<txt.length-1?' ':'');say.appendChild(s);words.push(s)})}
let fx=false,pin=false;
const setModes=()=>{
 fx=false;pin=!RM&&innerHeight>=520; // films no longer grow to full screen (22 Nov): clean rows, click expands
 root.classList.toggle('fx',fx);root.classList.toggle('pin',pin);
 if(!fx)scenes.forEach(s=>{if(s.film){s.film.style.cssText=''}s.fades.forEach(e=>{e.style.opacity='';e.style.transform=''});if(s.cap)s.cap.classList.remove('on')});
 if(!pin){words.forEach(w=>w.style.opacity='');steps.forEach(l=>l.style.opacity='')}
 upd();
};
const prog=el=>{const r=el.getBoundingClientRect();return {r,p:clamp(-r.top/Math.max(1,r.height-innerHeight),0,1)}};
function upd(){
 const vh=innerHeight;
 if(fx)for(const s of scenes){
  const {r,p}=prog(s.el);if(r.bottom<-vh*.3||r.top>vh*1.3)continue;
  const e=ss(clamp(p/.45,0,1)),sr=s.stage.getBoundingClientRect(),a=s.slot.getBoundingClientRect();
  const L=a.left-sr.left,T=a.top-sr.top,W=a.width,H=a.height,f=s.film.style;
  f.left=(L*(1-e)).toFixed(1)+'px';f.top=(T*(1-e)).toFixed(1)+'px';f.width=(W+(sr.width-W)*e).toFixed(1)+'px';f.height=(H+(sr.height-H)*e).toFixed(1)+'px';
  const o=1-clamp(p/.3,0,1);
  s.fades.forEach(x=>{x.style.opacity=o.toFixed(3);x.style.transform='translateY('+((-(1-o)*36)).toFixed(1)+'px)'});
  if(s.cap)s.cap.classList.toggle('on',p>.48);
 }
 if(pin&&words.length){const {p}=prog(sayEl);const n=words.length,lit=clamp(p/.78,0,1)*(n+6);words.forEach((w,i)=>{w.style.opacity=(.13+.87*clamp((lit-i)/6,0,1)).toFixed(3)})}
 if(pin&&steps.length){const {p}=prog(how);const n=steps.length,lit=clamp(p/.8,0,1)*(n+.9);steps.forEach((l,i)=>{const k=clamp(lit-i,0,1);l.style.opacity=(.16+.84*k).toFixed(3);l.style.transform='translateY('+((1-k)*18).toFixed(1)+'px)'})}
}
// header tucks away on the way down, returns on the way up
const hd=d.querySelector('.hd');let ly=scrollY;
const hdr=()=>{const y=scrollY;if(hd){if(y>160&&y>ly+3&&!root.classList.contains('lock'))hd.classList.add('up');else if(y<ly-3||y<160)hd.classList.remove('up')}ly=y};
let tick=0;const on=()=>{if(tick)return;tick=requestAnimationFrame(()=>{tick=0;upd();hdr()})};
addEventListener('scroll',on,{passive:true});addEventListener('resize',()=>{setModes()});
if(d.fonts&&d.fonts.ready)d.fonts.ready.then(()=>upd());
addEventListener('load',()=>upd());
if(scenes.length||say||how)setModes();
// smooth, inertial wheel scrolling (mouse only)
if(false){ // custom wheel scrolling off: it stalled when frames were slow (22 Nov); the browser scrolls natively
 let tgt=scrollY,cur=scrollY,raf=0;
 const max=()=>d.documentElement.scrollHeight-innerHeight;
 const step=()=>{cur+=(tgt-cur)*.11;if(Math.abs(tgt-cur)<.4)cur=tgt;scrollTo({top:cur,behavior:'instant'});if(cur!==tgt)raf=requestAnimationFrame(step);else raf=0};
 addEventListener('wheel',e=>{if(e.ctrlKey||e.defaultPrevented||root.classList.contains('lock')||e.target.closest('.ask,.mnu,textarea,[data-native]'))return;
  e.preventDefault();if(!raf){tgt=cur=scrollY}
  const dy=e.deltaMode===1?e.deltaY*32:e.deltaMode===2?e.deltaY*innerHeight:e.deltaY;
  tgt=clamp(tgt+dy,0,max());if(!raf)raf=requestAnimationFrame(step)},{passive:false});
 addEventListener('scroll',()=>{if(!raf){tgt=cur=scrollY}},{passive:true});
}
// legal page contents list follows the reader
const L=[...d.querySelectorAll('.toc a')];
if(L.length){
 const H=L.map(a=>d.getElementById(a.hash.slice(1)));
 const on=()=>{let k=0;H.forEach((h,i)=>{if(h&&h.getBoundingClientRect().top<innerHeight*.35)k=i});L.forEach((a,i)=>a.classList.toggle('on',i===k))};
 addEventListener('scroll',on,{passive:true});on();
}
})();

// ---- click a project film: it expands to full width and plays the full film with sound (22 Nov) ----
(()=>{const d=document;
 const fullOf=src=>{const b=src.replace(/-loop(-1440)?\.mp4$/,'');return b===src?[]:[b+'.mp4',b+'-film-1440.mp4',b+'-app.mp4']};
 const find=async list=>{for(const u of list){try{const r=await fetch(u,{method:'HEAD'});if(r.ok&&(r.headers.get('content-type')||'').includes('video'))return u}catch(_){}}return null};
 const close=sec=>{const box=sec.querySelector('.hxf,.slot .film'),v=box&&box.querySelector('video');sec.classList.remove('xp');const x=box&&box.querySelector('.xpx');if(x)x.remove();
  if(v&&v.dataset.loop){v.src=v.dataset.loop;v.muted=true;v.loop=true;v.controls=false;v.play().catch(()=>{})}};
 d.addEventListener('click',async e=>{
  if(e.target.closest('.xpx')){e.preventDefault();close(e.target.closest('.hx,.scene'));return}
  const pb=e.target.closest('.xpb');const box=pb?pb.closest('.hx').querySelector('.hxf'):e.target.closest('.hxf,.scene:not(.hero) .film');if(!box)return;e.preventDefault();
  const sec=box.closest('.hx,.scene');if(!sec||sec.classList.contains('xp'))return;
  d.querySelectorAll('.xp').forEach(close);
  const v=box.querySelector('video');sec.classList.add('xp');
  const x=d.createElement('button');x.type='button';x.className='xpx';x.setAttribute('aria-label',d.documentElement.lang==='de'?'Schließen':'Close');x.textContent='×';box.appendChild(x);
  setTimeout(()=>box.scrollIntoView({behavior:'smooth',block:'center'}),80);
  if(!v)return;const loop=v.getAttribute('src')||v.dataset.src||'';v.dataset.loop=loop;
  const full=v.dataset.full||await find(fullOf(new URL(loop,location.href).href));
  if(full)v.src=full;v.loop=!full;v.controls=true;v.muted=false;v.currentTime=0;v.play().catch(()=>{v.muted=true;v.play().catch(()=>{})});if(innerWidth<761){try{(v.requestFullscreen||v.webkitEnterFullscreen||(()=>{})).call(v)}catch(_){}}
 });
 addEventListener('keydown',e=>{if(e.key==='Escape')d.querySelectorAll('.xp').forEach(close)});
})();
