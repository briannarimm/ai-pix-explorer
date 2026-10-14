/* ==== ART: primitives and props. Everything is drawn in code as chunky-outline SVG, 960 x 720 scenes. ==== */
const INK='#1a1033';
const A={
  // basic shapes (strings)
  r(x,y,w,h,f,o={}){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r||0}" fill="${f}" stroke="${o.s??INK}" stroke-width="${o.sw??4}" ${o.x||''}/>`},
  e(cx,cy,rx,ry,f,o={}){return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}" stroke="${o.s??INK}" stroke-width="${o.sw??4}" ${o.x||''}/>`},
  p(d,f,o={}){return `<path d="${d}" fill="${f}" stroke="${o.s??INK}" stroke-width="${o.sw??4}" stroke-linejoin="round" stroke-linecap="round" ${o.x||''}/>`},
  l(x1,y1,x2,y2,o={}){return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.s??INK}" stroke-width="${o.sw??4}" stroke-linecap="round" ${o.x||''}/>`},
  t(x,y,txt,o={}){return `<text x="${x}" y="${y}" text-anchor="${o.a||'middle'}" font-family="${o.f||'Bungee, Arial Black, sans-serif'}" font-size="${o.fs||20}" fill="${o.c||INK}" ${o.sk?`stroke="${o.sk}" stroke-width="${o.skw||3}" paint-order="stroke"`:''} ${o.x||''}>${txt}</text>`},
  g(inner,o=''){return `<g ${o}>${inner}</g>`},
  // seeded random so scenes look the same every time
  rng(seed){let s=seed*9301+49297;return()=>{s=(s*9301+49297)%233280;return s/233280}},
  BOOKC:['#ff2d95','#2f8cff','#ffd92e','#36d65a','#8b4dff','#ff8a1f','#e8dcc0','#2aa7a0','#d4004f'],
  // ---- props ----
  shelf(x,y,w,h,seed=1,rows=4){const R=A.rng(seed);let s=A.r(x,y,w,h,'#9a6a3f',{r:6});const rh=(h-16)/rows;
    for(let i=0;i<rows;i++){const ry=y+8+i*rh;s+=A.r(x+8,ry,w-16,rh-6,'#6e4526',{sw:3});let bx=x+12;
      while(bx<x+w-22){const bw=10+R()*14,bh=rh*(.55+R()*.35);s+=A.r(bx,ry+rh-6-bh,bw,bh,A.BOOKC[Math.floor(R()*A.BOOKC.length)],{sw:2.5});if(R()>.8){bx+=bw+2;s+=A.p(`M${bx} ${ry+rh-6} l${bw*.8} ${-bh*.9} l${bw*.8} ${bh*.9}z`,A.BOOKC[Math.floor(R()*9)],{sw:2.5});bx+=bw*1.6}else bx+=bw+1}
      s+=A.r(x+8,ry+rh-6,w-16,6,'#c99a67',{sw:3})}
    return s},
  win(x,y,w,h,o={}){const sky=o.sky||'url(#g-sky)';const arch=o.arch;let s='';const cx=x+w/2;
    const clip=arch?`M${x} ${y+h} V${y+w/2} A${w/2} ${w/2} 0 0 1 ${x+w} ${y+w/2} V${y+h}Z`:`M${x} ${y}H${x+w}V${y+h}H${x}Z`;
    s+=A.p(clip,sky,{sw:6});
    s+=o.inner||`${A.cloud(x+w*.3,y+h*.3,.55)}${A.cloud(x+w*.7,y+h*.55,.4)}`;
    s+=A.p(clip,'none',{sw:7,s:o.frame||'#7a4a26'});
    s+=A.l(cx,arch?y+4:y,cx,y+h,{sw:5,s:o.frame||'#7a4a26'})+A.l(x,y+h*.52,x+w,y+h*.52,{sw:5,s:o.frame||'#7a4a26'});
    s+=A.r(x-8,y+h-2,w+16,14,'#c99a67',{r:3});return s},
  cloud(x,y,sc=1){return `<g transform="translate(${x} ${y}) scale(${sc})" opacity=".95">${A.p('M-40 12 q-22 0 -22 -18 q0 -18 22 -18 q6 -22 32 -18 q28 -10 40 14 q26 0 26 22 q0 18 -26 18z','#fff',{sw:3.5})}</g>`},
  clock(x,y,r,hh=9,mm=3){const a=(v,l,w)=>A.l(x,y,x+Math.sin(v)*l,y-Math.cos(v)*l,{sw:w});let s=A.e(x,y,r+8,r+8,'#c99a67',{sw:5})+A.e(x,y,r,r,'#fffdf4',{sw:4});
    for(let i=0;i<12;i++){const t=i*Math.PI/6;s+=A.l(x+Math.sin(t)*(r-8),y-Math.cos(t)*(r-8),x+Math.sin(t)*(r-2),y-Math.cos(t)*(r-2),{sw:3})}
    return s+a(((hh%12)+mm/60)*Math.PI/6,r*.5,5)+a(mm*Math.PI/30,r*.78,3.5)+A.e(x,y,5,5,'#ff2d95',{sw:2})},
  desk(x,y,w,h=70,c='#b87f4a'){return A.r(x,y,w,h,c,{r:6})+A.r(x-10,y-14,w+20,20,'#d49a62',{r:6})+A.l(x+14,y+16,x+w-14,y+16,{sw:2,s:'rgba(26,16,51,.35)'})+A.l(x+14,y+34,x+w-14,y+34,{sw:2,s:'rgba(26,16,51,.25)'})},
  mug(x,y,c='#ff2d95'){return A.r(x,y,34,38,c,{r:6,sw:3.5})+A.p(`M${x+34} ${y+8} q16 0 16 12 q0 12 -16 12`,'none',{sw:3.5})+A.p(`M${x+9} ${y-4} q-4 -8 2 -14 M${x+20} ${y-4} q-4 -8 2 -14`,'none',{sw:2.5,s:'rgba(26,16,51,.5)'})},
  plant(x,y,sc=1){return `<g transform="translate(${x} ${y}) scale(${sc})">${A.p('M0 0 q-34 -40 -10 -80 q16 30 10 80z','#36d65a',{sw:3.5})}${A.p('M0 0 q40 -30 34 -78 q-26 24 -34 78z','#2ab84a',{sw:3.5})}${A.p('M0 0 q-6 -60 18 -96 q4 46 -18 96z','#5fe67f',{sw:3.5})}${A.p('M-30 0 h60 l-8 54 h-44z','#d4553a',{sw:4})}${A.r(-34,-6,68,14,'#e8704f',{r:3,sw:3.5})}</g>`},
  lamp(x,y,sc=1,on=true){return `<g transform="translate(${x} ${y}) scale(${sc})">${A.l(0,0,0,-62,{sw:5})}${A.l(0,-62,34,-84,{sw:5})}${A.p('M34 -84 l-22 -4 l-6 26 l34 6z','#ffd92e',{sw:4})}${A.e(0,2,24,7,'#6e4526',{sw:4})}${on?`<path d="M18 -62 l-24 60 h60z" fill="rgba(255,244,184,.35)"/>`:''}</g>`},
  crt(x,y,w,h,screen='#12301f',inner='',o={}){const sw=w*.8,sh=h*.7;return A.r(x,y,w,h,'#e8dcc0',{r:12})+A.r(x+w*.1,y+h*.08,sw,sh,screen,{r:10,sw:4})+(inner?`<g transform="translate(${x+w*.1} ${y+h*.08})">${inner}</g>`:'')+A.r(x+w*.1,y+h*.08,sw,sh,'url(#p-scan)',{r:10,sw:0})+A.e(x+w*.85,y+h*.9,5,5,'#36d65a',{sw:2})+A.r(x+w*.15,y+h*.86,w*.35,h*.05,'#b9ad8e',{r:2,sw:2.5})+(o.stand===false?'':A.r(x+w*.3,y+h,w*.4,14,'#cfc3a2',{r:3})+A.r(x+w*.15,y+h+12,w*.7,12,'#e8dcc0',{r:4}))},
  poster(x,y,w,h,txt,c='#ffd92e',o={}){const lines=String(txt).split('|');return `<g transform="rotate(${o.rot||0} ${x+w/2} ${y+h/2})">${A.r(x,y,w,h,c,{sw:4,r:3})}${lines.map((ln,i)=>A.t(x+w/2,y+h/2+(i-(lines.length-1)/2)*(o.fs||18)*1.25+(o.fs||18)*.35,ln,{fs:o.fs||18,c:o.c||INK})).join('')}</g>`},
  floorTile(y,h,c1='#2aa7a0',c2='#f4ecd8',s=60){let o=A.r(0,y,960,h,c2,{sw:0});for(let yy=0;yy<h;yy+=s)for(let xx=0;xx<960;xx+=s)if(((xx/s)+(yy/s))%2===0)o+=`<rect x="${xx}" y="${y+yy}" width="${s}" height="${Math.min(s,h-yy)}" fill="${c1}"/>`;return o+A.l(0,y,960,y,{sw:5})},
  floorWood(y,h,c1='#b8895a',c2='#a37446'){let o=A.r(0,y,960,h,c1,{sw:0});for(let i=0;i<h;i+=36){o+=`<rect x="0" y="${y+i}" width="960" height="18" fill="${c2}" opacity=".5"/>`;o+=A.l(0,y+i,960,y+i,{sw:2,s:'rgba(26,16,51,.35)'})}for(let i=0;i<9;i++)o+=A.l(100+i*110+(i%2)*40,y,100+i*110+(i%2)*40,y+h,{sw:2,s:'rgba(26,16,51,.18)'});return o+A.l(0,y,960,y,{sw:5})},
  rug(x,y,w,h,c='#ff2d95'){return A.e(x+w/2,y+h/2,w/2,h/2,c,{sw:5})+A.e(x+w/2,y+h/2,w/2-18,h/2-10,'none',{sw:3,s:'#ffd92e'})+A.e(x+w/2,y+h/2,w/2-40,h/2-22,'#fff4b8',{sw:3})},
  door(x,y,w,h,label='',c='#8b4dff'){return A.r(x,y,w,h,c,{r:8})+A.r(x+10,y+12,w-20,h*.4,'rgba(255,255,255,.3)',{r:4,sw:3})+A.r(x+10,y+h*.5,w-20,h*.4,'rgba(255,255,255,.2)',{r:4,sw:3})+A.e(x+w-16,y+h*.55,6,6,'#ffd92e',{sw:3})+(label?A.r(x+w*.15,y-30,w*.7,24,'#fff',{r:4,sw:3})+A.t(x+w/2,y-12,label,{fs:13}):'')},
  cabinet(x,y,w,h,cols=3,rows=5){let s=A.r(x,y,w,h,'#9a6a3f',{r:6});const cw=(w-16)/cols,rh=(h-16)/rows;for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){const cx=x+8+j*cw,cy=y+8+i*rh;s+=A.r(cx+2,cy+2,cw-4,rh-4,'#c99a67',{r:3,sw:3})+A.r(cx+cw/2-12,cy+rh/2-8,24,8,'#fffdf4',{r:2,sw:2})+A.e(cx+cw/2,cy+rh/2+6,3.5,3.5,'#ffd92e',{sw:2})}return s},
  globe(x,y,r){return A.r(x-r*.7,y+r*.9,r*1.4,10,'#6e4526',{r:3})+A.l(x,y+r,x,y+r*.9,{sw:5})+A.e(x,y,r,r,'#2f8cff',{sw:4})+A.p(`M${x-r*.5} ${y-r*.3} q${r*.3} -${r*.4} ${r*.5} -${r*.1} q${r*.2} ${r*.5} -${r*.2} ${r*.6} q-${r*.3} 0 -${r*.3} -${r*.5}z M${x+r*.2} ${y+r*.2} q${r*.3} -${r*.1} ${r*.4} ${r*.2} q-${r*.1} ${r*.4} -${r*.4} ${r*.3}z`,'#36d65a',{sw:3})+A.p(`M${x-r} ${y} h${2*r} M${x} ${y-r} v${2*r}`,'none',{sw:2,s:'rgba(255,255,255,.55)'})},
  chalk(x,y,w,h,inner=''){return A.r(x-10,y-10,w+20,h+20,'#9a6a3f',{r:6})+A.r(x,y,w,h,'#1f5a45',{r:3,sw:4})+`<g font-family="VT323, monospace" fill="#f4ecd8">${inner}</g>`+A.r(x,y+h+10,w,10,'#c99a67',{r:3,sw:3})},
  banner(x,y,w,txt,c='#ff2d95',fs=22){return A.p(`M${x} ${y} h${w} v62 l-${w/2} -18 l-${w/2} 18z`,c,{sw:4})+A.t(x+w/2,y+30,txt,{fs,c:'#fff',sk:INK})},
  stool(x,y,c='#ff8a1f'){return A.r(x-4,y,48,12,c,{r:5})+A.l(x+6,y+12,x-2,y+44,{sw:5})+A.l(x+34,y+12,x+42,y+44,{sw:5})},
  crate(x,y,w,h,txt=''){return A.r(x,y,w,h,'#c99a67',{r:3})+A.l(x,y+h*.35,x+w,y+h*.35,{sw:3})+A.l(x,y+h*.68,x+w,y+h*.68,{sw:3})+(txt?A.t(x+w/2,y+h*.58,txt,{fs:Math.min(16,w/5)}):'')},
  star(x,y,r,c='#ffd92e',sw=3){let d='';for(let i=0;i<10;i++){const rr=i%2?r*.45:r,a=-Math.PI/2+i*Math.PI/5;d+=(i?'L':'M')+(x+Math.cos(a)*rr).toFixed(1)+' '+(y+Math.sin(a)*rr).toFixed(1)}return A.p(d+'Z',c,{sw})},
  brick(x,y,w,h,c,n=2){let s=A.r(x,y,w,h,c,{r:5,sw:3.5});for(let i=0;i<n;i++)s+=A.e(x+w*(i+.5)/n,y-3,w/(n*3.2),4.5,c,{sw:3});return s+`<path d="M${x+5} ${y+7} h${w-10}" stroke="rgba(255,255,255,.5)" stroke-width="3" stroke-linecap="round"/>`},
  die(x,y,s,face=5,c='#fff'){const d=A.r(x,y,s,s,c,{r:s*.18,sw:4});const P={1:[[.5,.5]],2:[[.25,.25],[.75,.75]],3:[[.25,.25],[.5,.5],[.75,.75]],4:[[.25,.25],[.75,.25],[.25,.75],[.75,.75]],5:[[.25,.25],[.75,.25],[.5,.5],[.25,.75],[.75,.75]],6:[[.25,.22],[.75,.22],[.25,.5],[.75,.5],[.25,.78],[.75,.78]]}[face];return d+P.map(([a,b])=>A.e(x+a*s,y+b*s,s*.07,s*.07,INK,{sw:0})).join('')},
  skyline(x,y,w,h){const R=A.rng(7);let s='';let bx=x;while(bx<x+w){const bw=30+R()*40,bh=h*(.3+R()*.65);s+=A.r(bx,y+h-bh,bw,bh,['#3a2f7a','#2d2566','#4a3d94'][Math.floor(R()*3)],{sw:2.5});for(let wy=y+h-bh+8;wy<y+h-10;wy+=14)for(let wx=bx+6;wx<bx+bw-8;wx+=12)if(R()>.45)s+=`<rect x="${wx}" y="${wy}" width="6" height="8" fill="${R()>.3?'#ffd92e':'#fff4b8'}"/>`;bx+=bw+4}return s},
  scales(x,y,sc=1){return `<g transform="translate(${x} ${y}) scale(${sc})">${A.l(0,-60,0,0,{sw:5})}${A.l(-44,-52,44,-52,{sw:5})}${A.l(-44,-52,-56,-14,{sw:3})}${A.l(-44,-52,-32,-14,{sw:3})}${A.l(44,-52,32,-14,{sw:3})}${A.l(44,-52,56,-14,{sw:3})}${A.p('M-66 -14 h20 q0 14 -10 14 q-10 0 -10 -14z','#ffd92e',{sw:3})}${A.p('M46 -14 h20 q0 14 -10 14 q-10 0 -10 -14z','#ffd92e',{sw:3})}${A.r(-20,0,40,10,'#c99a67',{r:3,sw:4})}</g>`},
  folder(x,y,w,h,c='#ffd92e',label=''){return A.p(`M${x} ${y+8} h${w*.4} l8 -8 h${w*.6-8} v${h} h-${w}z`,c,{sw:3.5})+(label?A.t(x+w/2,y+h*.62,label,{fs:Math.min(14,w/7)}):'')},
  paper(x,y,w,h,rot=0){return `<g transform="rotate(${rot} ${x+w/2} ${y+h/2})">${A.r(x,y,w,h,'#fff',{sw:3})}${[0,1,2,3].map(i=>A.l(x+8,y+14+i*10,x+w-8-(i%2)*14,y+14+i*10,{sw:2,s:'#8a8494'})).join('')}</g>`},
  sticky(x,y,s,c='#ffd92e',rot=0,txt=''){return `<g transform="rotate(${rot} ${x+s/2} ${y+s/2})">${A.r(x,y,s,s,c,{sw:3})}${txt?A.t(x+s/2,y+s/2+4,txt,{fs:s/4.2,f:'VT323, monospace'}):''}</g>`},
  rack(x,y,w,h){let s=A.r(x,y,w,h,'#3a3a52',{r:5});for(let i=0;i<Math.floor(h/36);i++){const yy=y+8+i*36;s+=A.r(x+8,yy,w-16,28,'#55556f',{r:3,sw:3});for(let j=0;j<5;j++)s+=A.e(x+22+j*14,yy+14,4,4,['#36d65a','#ffd92e','#ff2d95','#2f8cff','#36d65a'][(i+j)%5],{sw:1.5});s+=A.r(x+w-50,yy+8,34,12,'#222',{r:2,sw:2})}return s},
  bubble(x,y,w,h,txt,o={}){return A.p(`M${x+12} ${y} h${w-24} q12 0 12 12 v${h-24} q0 12 -12 12 h-${w/2-30} l-14 16 l2 -16 h-${w/2-16} q-12 0 -12 -12 v-${h-24} q0 -12 12 -12z`,o.c||'#fff',{sw:3.5})+A.t(x+w/2+6,y+h/2+6,txt,{fs:o.fs||16,c:INK})}
};

/* shared <defs>: gradients and patterns, injected once into the document */
const DEFS_SVG=`<svg id="artdefs" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<linearGradient id="g-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cd0f2"/><stop offset="1" stop-color="#cdf1fb"/></linearGradient>
<linearGradient id="g-dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b1b6e"/><stop offset=".6" stop-color="#ff5fa6"/><stop offset="1" stop-color="#ffb347"/></linearGradient>
<linearGradient id="g-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f9edc8"/><stop offset="1" stop-color="#f0ddab"/></linearGradient>
<linearGradient id="g-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0a24"/><stop offset="1" stop-color="#2d2566"/></linearGradient>
<radialGradient id="g-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff9c4" stop-opacity=".9"/><stop offset="1" stop-color="#fff9c4" stop-opacity="0"/></radialGradient>
<pattern id="p-scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="2" fill="rgba(0,0,0,.18)"/></pattern>
<pattern id="p-dith" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="rgba(26,16,51,.18)"/><rect x="3" y="3" width="3" height="3" fill="rgba(26,16,51,.18)"/></pattern>
<pattern id="p-dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.2" fill="rgba(255,255,255,.35)"/></pattern>
<pattern id="p-stripe" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="24" fill="rgba(255,255,255,.22)"/></pattern>
<pattern id="p-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="rgba(26,16,51,.14)" stroke-width="2"/></pattern>
</defs></svg>`;
