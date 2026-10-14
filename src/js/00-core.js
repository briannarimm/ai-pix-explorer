/* ==== CORE: helpers, storage, state, events, sound ==== */
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const NS='http://www.w3.org/2000/svg';
const el=(tag,attrs={},parent)=>{const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* h('div.cls#id',{attr},child,...) builds HTML elements. Children may be strings (as text), nodes or arrays. */
function h(sel,attrs,...kids){
  const m=/^([a-z0-9]+)?((?:[.#][\w-]+)*)$/i.exec(sel)||[];const e=document.createElement(m[1]||'div');
  (m[2]||'').replace(/([.#])([\w-]+)/g,(_,t,n)=>{t==='.'?e.classList.add(n):e.id=n});
  if(attrs&&(attrs.nodeType||typeof attrs==='string'||Array.isArray(attrs))){kids.unshift(attrs);attrs=null}
  for(const k in (attrs||{})){const v=attrs[k];if(v==null||v===false)continue;
    if(k==='html')e.innerHTML=v;else if(k.startsWith('on'))e.addEventListener(k.slice(2),v);else if(k==='style'&&typeof v==='object')Object.assign(e.style,v);else e.setAttribute(k,v===true?'':v)}
  const add=k=>{if(k==null||k===false)return;if(Array.isArray(k))k.forEach(add);else e.append(k.nodeType?k:document.createTextNode(k))};
  kids.forEach(add);return e;
}
const store={mem:{},get(k){try{const v=localStorage.getItem(k);return v==null?(this.mem[k]??null):v}catch(e){return this.mem[k]??null}},
  set(k,v){this.mem[k]=v;try{localStorage.setItem(k,v)}catch(e){}},del(k){delete this.mem[k];try{localStorage.removeItem(k)}catch(e){}}};
const C={pink:'#ff2d95',lemon:'#ffd92e',lime:'#36d65a',sky:'#2f8cff',grape:'#8b4dff',tang:'#ff8a1f',ink:'#1a1033',paper:'#fffdf4',
  pinkL:'#ffd3e8',lemonL:'#fff4b8',limeL:'#d2f7da',skyL:'#d4e7ff',grapeL:'#e6dbff',tangL:'#ffe2c6',lo:'#8a8494',silver:'#d6d2ca'};
const reduceMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep=ms=>new Promise(r=>setTimeout(r,reduceMotion()?Math.min(ms,30):ms));
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];

/* ---------- event bus ---------- */
const BUS={fns:{},on(e,f){(this.fns[e]=this.fns[e]||[]).push(f);return()=>this.off(e,f)},off(e,f){this.fns[e]=(this.fns[e]||[]).filter(x=>x!==f)},emit(e,d){(this.fns[e]||[]).slice().forEach(f=>{try{f(d)}catch(err){console.error(err)}})}};

/* ---------- game state + save ---------- */
const SAVE_KEY='aipix2-save';
const DEFAULTS=()=>({v:2,name:'',lvl:0,beat:0,done:{},stars:{},stickers:{},seen:{},quiz:{},flags:{},toys:{},started:false,
  set:{sound:false,music:false,speed:'normal',sparkle:true}});
let G=DEFAULTS();
function loadSave(){try{const raw=store.get(SAVE_KEY);if(raw){const o=JSON.parse(raw);if(o&&o.v===2){G=Object.assign(DEFAULTS(),o);G.set=Object.assign(DEFAULTS().set,o.set||{});return true}}}catch(e){}return false}
let saveT=null;
function save(){clearTimeout(saveT);saveT=setTimeout(()=>store.set(SAVE_KEY,JSON.stringify(G)),150)}
function resetSave(){store.del(SAVE_KEY);G=DEFAULTS()}

/* ---------- sound: tiny synth, off by default ---------- */
const SND=(()=>{
  let ctx=null,master=null,musicGain=null,timer=null,step=0,mood=null,nextT=0;
  const ok=()=>{if(!G.set.sound)return false;try{if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=.5;master.connect(ctx.destination);musicGain=ctx.createGain();musicGain.gain.value=.12;musicGain.connect(master)}
    if(ctx.state==='suspended')ctx.resume();return true}catch(e){return false}};
  const tone=(f,d,type='square',vol=.07,when=0,dest)=>{const t=ctx.currentTime+when;const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t);
    g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(dest||master);o.start(t);o.stop(t+d+.02);return o};
  const slide=(f0,f1,d,type='square',vol=.07,when=0)=>{const o=tone(f0,d,type,vol,when);o.frequency.exponentialRampToValueAtTime(f1,ctx.currentTime+when+d)};
  const noise=(d=.12,vol=.08,hp=1200)=>{const n=Math.floor(ctx.sampleRate*d),b=ctx.createBuffer(1,n,ctx.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);
    const s=ctx.createBufferSource();s.buffer=b;const f=ctx.createBiquadFilter();f.type='highpass';f.frequency.value=hp;const g=ctx.createGain();g.gain.value=vol;s.connect(f);f.connect(g);g.connect(master);s.start()};
  const N=m=>440*Math.pow(2,(m-69)/12);
  const SFX={
    click(){tone(760,.05,'square',.05)},
    tool(){slide(rnd(300,500),rnd(900,1500),.16,'square',.06);tone(rnd(500,900),.08,'triangle',.05,.1)},
    page(){noise(.14,.09,1800)},
    ok(){[72,76,79].forEach((m,i)=>tone(N(m),.12,'square',.06,i*.07))},
    no(){slide(220,110,.2,'sawtooth',.06)},
    star(){slide(500,1600,.25,'triangle',.08)},
    tada(){[72,76,79,84].forEach((m,i)=>tone(N(m),.22,'square',.06,i*.09));tone(N(88),.5,'triangle',.07,.4)},
    pop(){slide(900,300,.09,'square',.05)},
    enter(){slide(250,700,.18,'triangle',.06)},
    open(){slide(300,900,.14,'square',.05);tone(1200,.05,'square',.04,.12)},
    close(){slide(900,300,.12,'square',.05)}
  };
  const VOICE={quill:[330,'triangle'],pixel:[1040,'square'],whitlock:[220,'triangle'],dash:[600,'square'],you:[440,'triangle'],tolliver:[392,'triangle'],narr:null};
  const MOODS={
    hub:{bpm:112,lead:[72,76,79,76,74,77,81,77,72,76,79,84,83,79,76,74],bass:[48,48,43,43,45,45,41,43],wave:'triangle'},
    lab:{bpm:100,lead:[69,0,72,0,76,72,0,69,67,0,71,0,74,71,0,67],bass:[45,45,41,41,43,43,40,40],wave:'square'},
    finale:{bpm:132,lead:[72,76,79,84,83,79,76,79,77,81,84,89,88,84,81,84],bass:[48,48,53,53,55,55,48,48],wave:'square'}
  };
  function sched(){if(!ctx||!mood)return;const M=MOODS[mood],sp=60/M.bpm/2;
    while(nextT<ctx.currentTime+.25){const i=step%M.lead.length;const n=M.lead[i];
      if(n){const o=ctx.createOscillator(),g=ctx.createGain();o.type=M.wave;o.frequency.value=N(n);const t=Math.max(nextT,ctx.currentTime);g.gain.setValueAtTime(.5,t);g.gain.exponentialRampToValueAtTime(.001,t+sp*.9);o.connect(g);g.connect(musicGain);o.start(t);o.stop(t+sp)}
      if(i%2===0){const b=M.bass[(i/2)%M.bass.length|0];const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.value=N(b);const t=Math.max(nextT,ctx.currentTime);g.gain.setValueAtTime(.7,t);g.gain.exponentialRampToValueAtTime(.001,t+sp*1.8);o.connect(g);g.connect(musicGain);o.start(t);o.stop(t+sp*2)}
      nextT+=sp;step++}}
  return{
    play(n){if(ok()&&SFX[n])try{SFX[n]()}catch(e){}},
    blip(who){if(!ok())return;const v=VOICE[who];if(!v)return;try{tone(v[0]*rnd(.92,1.12),.045,v[1],.035)}catch(e){}},
    music(m){mood=m;if(!G.set.music||!ok()){this.stopMusic();return}if(!timer){step=0;nextT=ctx.currentTime+.05;timer=setInterval(sched,60)}},
    stopMusic(){clearInterval(timer);timer=null},
    setMood(m){if(mood!==m){mood=m;step=0}},
    unlock(){ok()}
  };
})();
const blip=(f=660)=>SND.play('click');
function toast(text,icon){const t=h('div.toast',{role:'status'},icon?h('span',{html:icon}):null,text);$('#floaters').appendChild(t);SND.play('star');setTimeout(()=>{t.style.transition='opacity .4s';t.style.opacity=0;setTimeout(()=>t.remove(),450)},2600)}

/* ---------- hints + click sparkles ---------- */
const DEFAULT_HINT='Hover over anything for a hint. Click the story to keep going.';
document.addEventListener('pointerover',e=>{const t=e.target.closest&&e.target.closest('[data-hint]');const hb=$('#hint');if(hb)hb.textContent=t?t.dataset.hint:hb.dataset.base||DEFAULT_HINT});
document.addEventListener('focusin',e=>{const t=e.target.closest&&e.target.closest('[data-hint]');const hb=$('#hint');if(t&&hb)hb.textContent=t.dataset.hint});
function setHint(t){const hb=$('#hint');if(hb){hb.dataset.base=t;hb.textContent=t}}
document.addEventListener('pointerdown',e=>{
  if(!G.set.sparkle||reduceMotion())return;const t=e.target;if(!(t.closest&&t.closest('.gwin')))return;
  const cols=[C.pink,C.lemon,C.lime,C.sky,C.grape,C.tang];const f=$('#floaters');
  for(let i=0;i<7;i++){const s=h('i.spark');const a=Math.random()*Math.PI*2,d=rnd(18,42);
    s.style.cssText=`left:${e.clientX-5}px;top:${e.clientY-5}px;position:fixed;background:${cols[i%6]};--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;--r:${rnd(-180,180)}deg`;f.appendChild(s);setTimeout(()=>s.remove(),750)}
},true);
