/* ==== ART: title screen illustration ==== */
function TITLE_ART(){
  let s=`<svg viewBox="0 0 960 720" preserveAspectRatio="xMidYMid slice" xmlns="${NS}" aria-hidden="true"><defs>${FACE_GLOW}</defs>`;
  s+=A.r(0,0,960,720,'url(#g-sky)',{sw:0});
  // sun burst
  let rays='';for(let i=0;i<20;i++){const a=i*Math.PI/10;rays+=`<path d="M480 330 L${480+Math.cos(a-.07)*900} ${330+Math.sin(a-.07)*900} L${480+Math.cos(a+.07)*900} ${330+Math.sin(a+.07)*900}Z" fill="rgba(255,255,255,.28)"/>`}
  s+=rays+A.e(480,330,92,92,'#ffd92e',{sw:6})+A.e(480,330,70,70,'#fff4b8',{sw:0});
  s+=A.cloud(130,170,1.6)+A.cloud(820,150,1.4)+A.cloud(250,400,1)+A.cloud(760,420,1.2);
  // hills + ground
  s+=A.p('M0 520 Q200 440 420 500 T960 470 V720 H0Z','#5fe67f',{sw:5})+A.p('M0 590 Q300 540 560 580 T960 560 V720 H0Z','#36d65a',{sw:5});
  // library building
  s+=A.r(200,380,560,170,'#f4ecd8',{sw:5})+A.p('M170 380 L480 250 L790 380Z','#d4004f',{sw:5})+A.p('M230 372 L480 268 L730 372Z','#ffd3e8',{sw:3.5});
  s+=A.e(480,330,28,28,'#fff',{sw:4})+A.t(480,339,'LAW',{fs:15});
  for(let i=0;i<6;i++){const x=224+i*96;s+=A.r(x,392,40,148,'#fffdf4',{sw:4})+A.r(x-6,384,52,14,'#d6d2ca',{sw:4})+A.r(x-6,534,52,14,'#d6d2ca',{sw:4})}
  s+=A.r(420,430,120,110,'#8b4dff',{r:8})+A.p('M420 450 q60 -48 120 0','#6a35d0',{sw:4});
  s+=A.r(180,548,600,22,'#d6d2ca',{sw:5})+A.r(160,568,640,22,'#b9b3c6',{sw:5});
  s+=A.banner(380,586,200,'HOLLIS HALL',A.BOOKC[7],18);
  // floating tokens
  const toks=[['the','#ffd92e',70,250,-8],['court','#ff2d95',800,260,7],['ing','#2f8cff',120,330,6],['tion','#36d65a',860,350,-6],['[CLS]','#8b4dff',690,200,4],['§','#ff8a1f',280,210,-5],['Q·K','#ff2d95',330,320,8],['p=0.4','#2f8cff',640,330,-7]];
  toks.forEach(([t,c,x,y,r])=>{const w=Math.max(54,t.length*17+20);s+=`<g transform="rotate(${r} ${x} ${y})">${A.brick(x-w/2,y-18,w,36,c,Math.max(1,Math.floor(w/36)))}${A.t(x,y+7,t,{fs:17,c:'#fff',sk:INK,skw:3})}</g>`});
  // characters
  s+=`<g transform="translate(20 330) scale(.78)">${drawPixel('happy',{arm:'up'})}</g>`;
  s+=`<g transform="translate(680 328) scale(.78)">${drawQuill('happy')}</g>`;
  s+=`<g transform="translate(560 420) scale(.45)">${drawDash('happy')}</g>`;
  return s+'</svg>';
}
