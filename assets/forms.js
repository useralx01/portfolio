// Start a project / Book a call. Same backend and same payload as the live site (see config.js).
(()=>{
const DE=document.documentElement.lang==='de';
const S=DE?{
 start:'Projekt starten',book:'Gespräch buchen',copied:'Kopiert',loc:'de-DE',sending:'Wird gesendet…',
 noSlots:'Gerade sind keine Zeiten frei. Starte stattdessen ein Projekt oder schreib an dretagro@gmail.com.',
 calFail:'Der Kalender konnte nicht geladen werden. Schreib an dretagro@gmail.com oder starte stattdessen ein Projekt.',
 pick:'wähl eine Zeit',about:'erzähl mir kurz, was du brauchst',name:'gib deinen Namen an',email:'gib eine gültige E-Mail an',please:'Bitte ',and:' und ',
 taken:'Diese Zeit wurde gerade vergeben. Bitte wähl eine andere.',
 fail:'Das Senden hat nicht geklappt. Stattdessen öffnet sich dein E-Mail-Programm mit deinen Antworten.',
 subjBook:'Gesprächsanfrage',subjProj:'Projektanfrage',
 thanks:'Danke, ',
 doneBook:(d,t,e)=>`Dein Gespräch ist gebucht: ${d} um ${t} Uhr deutscher Zeit. Die Kalendereinladung ist unterwegs an ${e}.`,
 doneProj:e=>`Deine Anfrage ist angekommen. Eine Kopie ist unterwegs an ${e}. Ich antworte innerhalb von zwei Werktagen mit Fragen, einem Plan und einem Preis.`,
 lTime:'Zeit',lTopic:'Thema',lName:'Name',lEmail:'E-Mail',lCompany:'Firma',lPhone:'Telefon',lNeeds:'Bedarf',lAbout:'Beschreibung',lBudget:'Budget',lWhen:'Wann',lLink:'Link',german:' (deutsche Zeit)'
}:{
 start:'Start a project',book:'Book a call',copied:'Copied',loc:'en-GB',sending:'Sending…',
 noSlots:'No free times right now. Start a project instead, or email dretagro@gmail.com.',
 calFail:'The calendar could not be loaded. Email dretagro@gmail.com or start a project instead.',
 pick:'pick a time',about:'tell me a little about what you need',name:'add your name',email:'add a valid email',please:'Please ',and:' and ',
 taken:'That time was just taken. Please pick another one.',
 fail:'Sending did not work. Your email app opens with your answers instead.',
 subjBook:'Call request',subjProj:'Project request',
 thanks:'Thank you, ',
 doneBook:(d,t,e)=>`Your call is booked for ${d} at ${t} German time. The calendar invite is on its way to ${e}.`,
 doneProj:e=>`Your request arrived. A copy is on its way to ${e}. I reply within two working days with questions, a plan and a price.`,
 lTime:'Time',lTopic:'Topic',lName:'Name',lEmail:'Email',lCompany:'Company',lPhone:'Phone',lNeeds:'Needs',lAbout:'About',lBudget:'Budget',lWhen:'When',lLink:'Link',german:' (German time)'
};
const API=new URLSearchParams(location.search).get('api')??window.PORTFOLIO_API;
const A=document.getElementById('ask');if(!A)return;
const sc=A,fp=document.getElementById('fproject'),fc=document.getElementById('fcall'),dn=document.getElementById('adone');
let mode='project',slots=null,back=null;
const bgEls=()=>[document.querySelector('header.hd'),document.querySelector('main'),document.querySelector('.mnu')].filter(Boolean);
function show(m){mode=m;fp.classList.toggle('on',m==='project');fc.classList.toggle('on',m==='call');dn.classList.remove('on');
 A.querySelectorAll('.aswap button').forEach(b=>b.classList.toggle('on',b.dataset.mode===m));A.setAttribute('aria-label',m==='call'?S.book:S.start);if(m==='call')loadSlots()}
function openAsk(m,need){back=document.activeElement;bgEls().forEach(e=>e.inert=true);show(m);
 if(need)fp.querySelectorAll('input[name=need]').forEach(c=>c.checked=c.value===need);
 sc.scrollTop=0;A.classList.add('on');A.setAttribute('aria-hidden','false');document.documentElement.classList.add('lock');
 setTimeout(()=>document.getElementById('aback').focus({preventScroll:true}),30)}
function closeAsk(){if(!A.classList.contains('on'))return;A.classList.remove('on');A.setAttribute('aria-hidden','true');document.documentElement.classList.remove('lock');bgEls().forEach(e=>e.inert=false);if(back&&back.focus)back.focus({preventScroll:true})}
window.__ask=openAsk;window.__askClose=closeAsk;
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-ask]');if(b){e.preventDefault();const mn=document.querySelector('.mnu');if(mn)mn.classList.remove('on');openAsk(b.dataset.ask,b.dataset.need)}
 const c=e.target.closest('[data-copy]');if(c){navigator.clipboard?.writeText(c.dataset.copy).catch(()=>{});const t=c.textContent;c.textContent=S.copied;setTimeout(()=>c.textContent=t,1400)}});
document.getElementById('aback').onclick=closeAsk;document.getElementById('aok').onclick=closeAsk;
A.querySelectorAll('.aswap button').forEach(b=>b.onclick=()=>{show(b.dataset.mode);sc.scrollTop=0});
addEventListener('keydown',e=>{if(e.key==='Escape'&&A.classList.contains('on'))closeAsk()});
const fmtDay=d=>d.toLocaleDateString(S.loc,{weekday:'long',day:'numeric',month:'long',timeZone:'Europe/Berlin'}),fmtT=d=>d.toLocaleTimeString(S.loc,{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Berlin'});
function loadSlots(){if(slots)return;const box=document.getElementById('slots');
 const fill=list=>{slots=list;if(!list.length){box.innerHTML='<p class="wait">'+S.noSlots+'</p>';return}
  const by={};list.slice(0,40).forEach(s=>{const d=new Date(s),k=fmtDay(d);(by[k]=by[k]||[]).push(s)});
  box.innerHTML=Object.entries(by).slice(0,5).map(([k,v])=>`<div class="day"><b>${k}</b><div class="chips">${v.map(s=>`<label class="chip"><input type="radio" name="slot" value="${s}"><span>${fmtT(new Date(s))}</span></label>`).join('')}</div></div>`).join('')};
 if(window.__slots)return fill(window.__slots);
 fetch(API+'?a=slots').then(r=>r.json()).then(d=>fill(d.ok?d.slots:[])).catch(()=>{box.innerHTML='<p class="wait">'+S.calFail+'</p>'})}
const val=(f,n)=>{const el=f.elements[n];return el?(el.value||'').trim():''},all=(f,n)=>[...f.querySelectorAll(`input[name=${n}]:checked`)].map(c=>c.value);
const okMail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
async function send(f,type){const err=f.querySelector('.err');err.textContent='';f.querySelectorAll('.bad').forEach(e=>e.classList.remove('bad'));
 const name=val(f,'name'),email=val(f,'email');let bad=[];if(!name)bad.push('name');if(!okMail(email))bad.push('email');
 if(type==='project'&&!all(f,'need').length&&!val(f,'about'))bad.push('about');if(type==='book'&&!all(f,'slot').length)bad.push('slot');
 if(bad.length){bad.forEach(n=>f.elements[n]?.classList?.add('bad'));const m=[];if(bad.includes('slot'))m.push(S.pick);if(bad.includes('about'))m.push(S.about);if(bad.includes('name'))m.push(S.name);if(bad.includes('email'))m.push(S.email);
  const re=/, ([^,]*)$/;err.textContent=S.please+m.join(', ').replace(re,S.and+'$1')+'.';return}
 let ans,rows;if(type==='project'){ans={name,email,company:val(f,'company'),phone:val(f,'phone'),budget:all(f,'budget')[0]||'',need:all(f,'need')};
  rows=[[S.lNeeds,ans.need.join(', ')],[S.lAbout,val(f,'about')],[S.lLink,val(f,'link')],[S.lBudget,ans.budget],[S.lWhen,all(f,'when')[0]||''],[S.lName,name],[S.lEmail,email],[S.lCompany,ans.company],[S.lPhone,ans.phone]]}
 else{const sl=all(f,'slot')[0];ans={name,email,company:val(f,'company'),slot:sl,topic:val(f,'topic')};rows=[[S.lTime,fmtDay(new Date(sl))+', '+fmtT(new Date(sl))+S.german],[S.lTopic,ans.topic],[S.lName,name],[S.lEmail,email],[S.lCompany,ans.company]]}
 rows=rows.filter(r=>r[1]);const btn=f.querySelector('button[type=submit]');btn.disabled=true;const t=btn.textContent;btn.textContent=S.sending;
 const mail=()=>{location.href='mailto:dretagro@gmail.com?subject='+encodeURIComponent(type==='book'?S.subjBook:S.subjProj)+'&body='+encodeURIComponent(rows.map(r=>r[0]+': '+r[1]).join('\n'))};
 try{const r=await fetch(API,{method:'POST',body:JSON.stringify({type,lang:DE?'de':'en',ans,rows,hp:val(f,'hp')})});const d=await r.json();
  if(d.ok){done(type,name,ans)}else if(d.error==='taken'){slots=null;loadSlots();err.textContent=S.taken}else{err.textContent=S.fail;mail()}}
 catch(e){err.textContent=S.fail;mail()}finally{btn.disabled=false;btn.textContent=t}}
function done(type,name,ans){fp.classList.remove('on');fc.classList.remove('on');dn.classList.add('on');sc.scrollTop=0;
 document.getElementById('adh').textContent=S.thanks+name.split(' ')[0]+'.';
 document.getElementById('adp').textContent=type==='book'?S.doneBook(fmtDay(new Date(ans.slot)),fmtT(new Date(ans.slot)),ans.email):S.doneProj(ans.email)}
[fp,fc].forEach(f=>f.addEventListener('input',e=>{e.target.classList?.remove('bad');if(!f.querySelector('.bad'))f.querySelector('.err').textContent=''}));
fp.addEventListener('submit',e=>{e.preventDefault();send(fp,'project')});fc.addEventListener('submit',e=>{e.preventDefault();send(fc,'book')});
})();
