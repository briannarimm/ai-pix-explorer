/* ==== ART: characters. Each is drawn in a 300 x 500 box; mood swaps the face. ==== */
const CHARS={
  quill:{name:'Dr. Quill',color:'#2aa7a0',voice:'quill'},
  pixel:{name:'Pixel',color:'#2f8cff',voice:'pixel'},
  whitlock:{name:'Whitlock',color:'#2b3a67',voice:'whitlock'},
  dash:{name:'Dash',color:'#ff5a2a',voice:'dash'},
  you:{name:'You',color:'#ff2d95',voice:'you'},
  narr:{name:'',color:'#574f6e',voice:null}
};
const FACE_GLOW=`<filter id="f-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

/* ---- Pixel: a CRT-headed robot. The face is drawn in phosphor green. ---- */
function pixelFace(m){
  const G='#7dffa0',st=`stroke="${G}" stroke-width="8" stroke-linecap="square" stroke-linejoin="miter" fill="none"`,fl=`fill="${G}"`;
  const E={neutral:`<rect x="112" y="88" width="14" height="22" ${fl}/><rect x="174" y="88" width="14" height="22" ${fl}/><path d="M128 140h44" ${st}/>`,
    happy:`<path d="M108 108 l14 -18 l14 18 M164 108 l14 -18 l14 18" ${st}/><path d="M124 130 q26 28 52 0" ${st}/>`,
    excited:`<circle cx="120" cy="100" r="13" ${fl}/><circle cx="180" cy="100" r="13" ${fl}/><circle cx="125" cy="95" r="4" fill="#0b2216"/><circle cx="185" cy="95" r="4" fill="#0b2216"/><path d="M118 128 h64 q0 30 -32 30 q-32 0 -32 -30z" ${fl}/>`,
    sad:`<path d="M106 98 l28 -8 M194 98 l-28 -8" ${st}/><rect x="112" y="102" width="12" height="16" ${fl}/><rect x="176" y="102" width="12" height="16" ${fl}/><path d="M126 148 q24 -22 48 0" ${st}/><rect x="112" y="124" width="6" height="14" fill="#9fd0ff"/>`,
    think:`<rect x="112" y="92" width="14" height="22" ${fl}/><path d="M168 90 h26 M168 104 h14" ${st}/><path d="M126 142 q8 -10 16 0 t16 0 t16 0" ${st} stroke-width="6"/><text x="196" y="80" font-family="VT323, monospace" font-size="34" fill="${G}">?</text>`,
    surprised:`<circle cx="120" cy="100" r="13" ${st} stroke-width="6"/><circle cx="180" cy="100" r="13" ${st} stroke-width="6"/><circle cx="150" cy="142" r="10" ${st} stroke-width="6"/>`,
    smug:`<rect x="106" y="94" width="26" height="14" ${fl}/><rect x="168" y="94" width="26" height="14" ${fl}/><path d="M104 92 h30 M166 92 h30" ${st} stroke-width="5"/><path d="M128 140 q22 8 46 -10" ${st}/>`,
    error:`<path d="M106 88 l28 28 M134 88 l-28 28 M166 88 l28 28 M194 88 l-28 28" stroke="#ff5a7a" stroke-width="8" stroke-linecap="square"/><path d="M122 146 l12 -12 l12 12 l12 -12 l12 12 l12 -12" stroke="#ff5a7a" stroke-width="7" fill="none"/>`,
    wink:`<path d="M106 90 l24 10 l-24 10" ${st} stroke-width="7"/><rect x="174" y="88" width="14" height="22" ${fl}/><path d="M124 130 q26 28 52 0" ${st}/>`,
    proud:`<path d="M108 110 q14 -22 28 0 M164 110 q14 -22 28 0" ${st}/><path d="M120 128 h60 q0 28 -30 28 q-30 0 -30 -28z" ${fl}/><path d="M210 70 l5 10 l10 3 l-10 3 l-5 10 l-5 -10 l-10 -3 l10 -3z" ${fl}/>`,
    sleepy:`<path d="M108 100 h26 M166 100 h26" ${st}/><circle cx="150" cy="142" r="7" ${st} stroke-width="5"/><text x="196" y="86" font-family="VT323, monospace" font-size="30" fill="${G}">z</text><text x="212" y="68" font-family="VT323, monospace" font-size="24" fill="${G}">z</text>`,
    dizzy:`<path d="M120 100 m-2 0 a4 4 0 1 1 8 0 a9 9 0 1 1 -18 0 a14 14 0 1 1 28 0" ${st} stroke-width="4"/><path d="M180 100 m-2 0 a4 4 0 1 1 8 0 a9 9 0 1 1 -18 0 a14 14 0 1 1 28 0" ${st} stroke-width="4"/><path d="M126 144 q8 -8 16 0 t16 0 t16 0" ${st} stroke-width="6"/>`};
  return E[m]||E.neutral;
}
function drawPixel(m='neutral',o={}){
  const bad=m==='error';
  return `<g class="bob" filter="none">
  <g transform="translate(0 78)">
  ${A.l(150,38,150,12,{sw:5})}${A.e(150,10,10,10,'#ffd92e',{sw:4})}
  ${A.r(40,86,26,58,'#ff2d95',{r:8,sw:4.5})}${A.r(234,86,26,58,'#ff2d95',{r:8,sw:4.5})}
  ${A.r(60,38,180,152,'#efe4c8',{r:32,sw:5})}
  ${A.r(80,54,140,118,bad?'#3a0b16':'#0b2216',{r:20,sw:4.5})}
  <g filter="url(#f-glow)">${pixelFace(m)}</g>
  <rect class="blink" x="100" y="80" width="100" height="40" fill="${bad?'#3a0b16':'#0b2216'}" opacity="0"/>
  ${A.r(80,54,140,118,'url(#p-scan)',{r:20,sw:0})}
  <path d="M92 66 q10 -8 40 -8 l-12 12 q-18 0 -28 8z" fill="rgba(255,255,255,.28)"/>
  ${A.r(130,190,40,16,'#b9ad8e',{r:3,sw:4})}
  ${A.r(84,204,132,126,'#2f8cff',{r:24,sw:5})}
  ${A.r(84,204,132,126,'url(#p-stripe)',{r:24,sw:0})}
  ${A.r(106,226,88,20,'#fff',{r:5,sw:3.5})}${A.t(150,242,'PIX',{fs:15})}
  ${A.r(106,262,88,12,'#1a1033',{r:3,sw:3})}${A.r(122,254,56,12,'#ffd92e',{r:2,sw:3,x:'transform="rotate(-3 150 260)"'})}
  ${A.e(120,302,7,7,'#ff2d95',{sw:3})}${A.e(150,302,7,7,'#ffd92e',{sw:3})}${A.e(180,302,7,7,'#36d65a',{sw:3})}
  ${o.arm==='up'?A.p('M86 236 Q46 210 38 150','none',{sw:26,s:INK})+A.p('M86 236 Q46 210 38 150','none',{sw:16,s:'#2f8cff'})+A.e(38,142,18,18,'#b9ad8e',{sw:4.5}):A.p('M88 240 Q50 290 62 340','none',{sw:26,s:INK})+A.p('M88 240 Q50 290 62 340','none',{sw:16,s:'#2f8cff'})+A.e(62,346,18,18,'#b9ad8e',{sw:4.5})}
  ${A.p('M212 240 Q250 290 238 340','none',{sw:26,s:INK})+A.p('M212 240 Q250 290 238 340','none',{sw:16,s:'#2f8cff'})+A.e(238,346,18,18,'#b9ad8e',{sw:4.5})}
  ${A.r(92,330,116,28,'#555',{r:10,sw:4.5})}
  ${A.e(116,380,26,26,'#333',{sw:5})}${A.e(116,380,9,9,'#8a8494',{sw:3})}${A.e(184,380,26,26,'#333',{sw:5})}${A.e(184,380,9,9,'#8a8494',{sw:3})}
  </g></g>`;
}

/* ---- humans: shared face ---- */
function humanFace(m,o){
  const sk=o.skin,br=`stroke="${INK}" stroke-width="5" stroke-linecap="round" fill="none"`;
  const lens=o.glasses?`<circle cx="124" cy="132" r="25" fill="rgba(255,255,255,.35)" stroke="${INK}" stroke-width="5"/><circle cx="176" cy="132" r="25" fill="rgba(255,255,255,.35)" stroke="${INK}" stroke-width="5"/><path d="M149 130 h2" stroke="${INK}" stroke-width="5"/><path d="M99 128 l-14 -4 M201 128 l14 -4" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`:'';
  const dot=(x,y,r=5.5)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x+1.8}" cy="${y-1.8}" r="1.7" fill="#fff"/>`;
  const closed=(x)=>`<path d="M${x-12} 134 q12 -14 24 0" ${br}/>`;
  const F={
    neutral:{brows:`<path d="M106 104 q16 -8 32 -2 M162 102 q16 -6 32 2" ${br}/>`,eyes:dot(124,132)+dot(176,132),mouth:`<path d="M134 168 q16 10 32 0" ${br}/>`},
    happy:{brows:`<path d="M106 102 q16 -10 32 -2 M162 100 q16 -8 32 2" ${br}/>`,eyes:dot(124,132)+dot(176,132),mouth:`<path d="M128 164 q22 28 44 0z" fill="#8a1c3a" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><path d="M136 170 q14 8 28 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`},
    laugh:{brows:`<path d="M106 100 q16 -12 32 -2 M162 98 q16 -10 32 2" ${br}/>`,eyes:closed(124)+closed(176),mouth:`<path d="M122 160 q28 40 56 0z" fill="#8a1c3a" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><path d="M140 182 q10 -8 20 0" stroke="#ff6a8a" stroke-width="6" fill="none"/>`},
    think:{brows:`<path d="M106 98 q16 -12 32 -4 M162 106 q16 -2 32 6" ${br}/>`,eyes:dot(130,132)+dot(182,132),mouth:`<path d="M136 170 q14 -4 26 -10" ${br}/>`},
    worried:{brows:`<path d="M106 108 q16 -2 32 -12 M162 96 q16 10 32 12" ${br}/>`,eyes:dot(124,134)+dot(176,134),mouth:`<path d="M134 172 q8 -8 16 0 t16 0" ${br}/>`},
    surprised:{brows:`<path d="M106 94 q16 -12 32 -2 M162 92 q16 -10 32 2" ${br}/>`,eyes:dot(124,132,6.5)+dot(176,132,6.5),mouth:`<ellipse cx="150" cy="170" rx="10" ry="13" fill="#8a1c3a" stroke="${INK}" stroke-width="4.5"/>`},
    stern:{brows:`<path d="M106 96 l32 10 M194 96 l-32 10" ${br}/>`,eyes:dot(124,134,4.8)+dot(176,134,4.8),mouth:`<path d="M134 172 h32" ${br}/>`},
    proud:{brows:`<path d="M106 102 q16 -10 32 -2 M162 100 q16 -8 32 2" ${br}/>`,eyes:closed(124)+closed(176),mouth:`<path d="M130 164 q20 20 40 0" ${br}/>`},
    wink:{brows:`<path d="M106 102 q16 -10 32 -2 M162 96 q16 -10 32 0" ${br}/>`,eyes:dot(124,132)+closed(176),mouth:`<path d="M128 164 q22 24 44 0z" fill="#8a1c3a" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>`}
  };
  const f=F[m]||F.neutral;
  const lids=`<ellipse class="blink" cx="124" cy="132" rx="${o.glasses?21:10}" ry="${o.glasses?21:10}" fill="${sk}" opacity="0"/><ellipse class="blink" cx="176" cy="132" rx="${o.glasses?21:10}" ry="${o.glasses?21:10}" fill="${sk}" opacity="0"/>`;
  return `${f.eyes}${lids}${lens}${f.brows}<ellipse cx="108" cy="160" rx="10" ry="6" fill="#ff6a8a" opacity=".35"/><ellipse cx="192" cy="160" rx="10" ry="6" fill="#ff6a8a" opacity=".35"/>${A.p('M148 142 q-4 14 4 16','none',{sw:3.5,s:'rgba(26,16,51,.6)'})}${f.mouth}`;
}
function drawQuill(m='neutral'){
  const sk='#c68a5e';
  return `<g class="bob">
  ${A.p('M40 500 L52 282 Q58 222 112 210 L188 210 Q242 222 248 282 L260 500Z','#2aa7a0',{sw:5})}
  ${A.p('M126 210 L150 272 L174 210Z','#ffd92e',{sw:4.5})}
  ${A.l(150,272,150,500,{sw:3.5,s:'rgba(26,16,51,.45)'})}${A.e(150,330,6,6,'#fff',{sw:3})}${A.e(150,390,6,6,'#fff',{sw:3})}${A.e(150,450,6,6,'#fff',{sw:3})}
  ${A.p('M128 222 l22 10 l22 -10 l-8 20 l-14 -6 l-14 6z','#ff2d95',{sw:4})}${A.e(150,232,6,6,'#d4004f',{sw:3})}
  ${A.p('M118 214 L134 330','none',{sw:4,s:'#ff8a1f'})}${A.r(112,318,38,50,'#fff',{r:5,sw:3.5})}${A.t(131,340,'HOLLIS',{fs:8.5})}${A.e(131,354,7,7,'#c68a5e',{sw:2})}
  ${A.r(134,184,32,34,sk,{r:8,sw:4.5})}
  ${A.e(150,132,64,70,sk,{sw:5})}
  ${A.e(86,134,12,16,sk,{sw:4.5})}${A.e(214,134,12,16,sk,{sw:4.5})}
  ${A.p('M82 118 Q84 62 150 60 Q216 62 218 118 Q196 82 150 84 Q104 82 82 118z','#e9e4f4',{sw:5})}
  ${A.e(150,44,34,32,'#e9e4f4',{sw:5})}${A.p('M130 40 q14 -14 28 0 M126 54 q24 -8 48 0','none',{sw:3,s:'rgba(26,16,51,.35)'})}
  ${A.e(86,100,16,16,'#e9e4f4',{sw:4.5})}${A.e(214,100,16,16,'#e9e4f4',{sw:4.5})}${A.p('M236 60 l8 -14 M64 56 l-8 -14','none',{sw:0})}
  ${humanFace(m,{skin:sk,glasses:true})}
  ${A.p('M40 340 Q20 420 56 470','none',{sw:0})}
  ${A.r(96,400,108,86,'#ff2d95',{r:8,sw:4.5})}${A.t(150,438,'READ',{fs:15,c:'#fff',sk:INK})}${A.t(150,458,'ME!',{fs:15,c:'#ffd92e',sk:INK})}
  ${A.e(92,444,16,16,sk,{sw:4.5})}${A.e(208,444,16,16,sk,{sw:4.5})}
  </g>`;
}
function drawWhitlock(m='stern'){
  const sk='#f0c09a';
  return `<g class="bob">
  ${A.p('M40 500 L50 284 Q56 224 112 210 L188 210 Q244 224 250 284 L260 500Z','#2b3a67',{sw:5})}
  ${A.p('M120 210 L150 292 L180 210 L168 206 L150 240 L132 206Z','#fff',{sw:4.5})}
  ${A.p('M112 212 L150 300 L100 360 L66 290Z','#223056',{sw:4.5})}${A.p('M188 212 L150 300 L200 360 L234 290Z','#223056',{sw:4.5})}
  ${A.p('M142 222 h16 l6 12 l-14 70 l-14 -70z','#d4004f',{sw:4})}
  ${A.r(84,380,134,90,'#ffd92e',{r:6,sw:4.5})}${A.t(150,434,'RUSH',{fs:20})}
  ${A.r(134,184,32,34,sk,{r:8,sw:4.5})}
  ${A.e(150,132,62,68,sk,{sw:5})}${A.e(88,136,11,15,sk,{sw:4.5})}${A.e(212,136,11,15,sk,{sw:4.5})}
  ${A.p('M86 122 Q84 62 150 58 Q222 60 216 126 Q210 96 176 88 Q124 80 100 108Z','#2a1a3a',{sw:5})}
  ${humanFace(m,{skin:sk,glasses:false})}
  ${A.e(86,446,16,16,sk,{sw:4.5})}${A.e(214,446,16,16,sk,{sw:4.5})}
  </g>`;
}
function drawDash(m='happy'){
  const sk='#e0a378';
  return `<g class="bob">
  ${A.p('M50 500 L58 292 Q64 238 112 222 L188 222 Q236 238 242 292 L250 500Z','#36d65a',{sw:5})}
  ${A.p('M100 230 L110 500 M200 230 L190 500','none',{sw:7,s:'#ffd92e'})}
  ${A.r(112,300,76,100,'#ff5a2a',{r:10,sw:4.5})}${A.t(150,356,'GO!',{fs:22,c:'#fff',sk:INK})}
  ${A.r(134,192,32,34,sk,{r:8,sw:4.5})}
  ${A.e(150,140,60,64,sk,{sw:5})}
  ${A.p('M82 128 Q80 60 150 56 Q220 60 218 128 L212 112 Q150 90 88 112z','#ff5a2a',{sw:5})}${A.p('M120 60 L160 90 L140 90 L170 120','none',{sw:6,s:'#fff4b8'})}
  ${A.r(96,100,108,22,'#2f8cff',{r:10,sw:4.5})}${A.e(124,111,14,10,'#d4e7ff',{sw:3.5})}${A.e(176,111,14,10,'#d4e7ff',{sw:3.5})}
  ${humanFace(m,{skin:sk,glasses:false}).replace(/<path d="M10[^"]*"[^>]*\/>/,'')}
  </g>`;
}
function charSVG(id,mood,o={}){
  const body=id==='pixel'?drawPixel(mood,o):id==='quill'?drawQuill(mood):id==='whitlock'?drawWhitlock(mood):id==='dash'?drawDash(mood):'';
  return `<svg viewBox="0 0 300 500" xmlns="${NS}" role="img" aria-label="${esc(CHARS[id].name)}, ${esc(mood)}"><defs>${FACE_GLOW}</defs>${body}</svg>`;
}
