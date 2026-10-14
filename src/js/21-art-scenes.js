/* ==== ART: scenes (backgrounds + the hotspots that sit on them). Coordinates are in the 960 x 720 scene space. ==== */
const SCENES={};
const HS=(x,y,w,h,label)=>({x,y,w,h,label});

SCENES.lobby={bgc:'#f6e7c1',draw(){
  let s=A.r(0,0,960,520,'url(#g-wall)',{sw:0});
  s+=A.r(0,0,960,34,'#c99a67',{sw:0})+A.l(0,34,960,34,{sw:5});
  s+=A.r(0,372,960,150,'#b8895a',{sw:0});for(let i=0;i<8;i++)s+=A.r(30+i*118,392,96,110,'#a37446',{r:4,sw:3});s+=A.l(0,372,960,372,{sw:5});
  s+=A.floorTile(520,200,'#2aa7a0','#f4ecd8',60);
  s+=A.win(60,90,150,280,{arch:true})+A.win(750,90,150,280,{arch:true});
  s+=A.shelf(250,80,190,270,3,5)+A.shelf(520,80,190,270,4,5);
  s+=A.clock(480,150,50,10,10)+A.poster(420,222,120,52,'SHHH!|QUIET PLEASE',A.BOOKC[2],{fs:14});
  s+=A.cabinet(770,372,150,160,3,4)+A.plant(40,528,1.1);
  s+=A.rug(250,556,460,120,'#ff2d95');
  s+=A.desk(110,468,330,80)+A.lamp(170,460,1)+A.mug(330,424)+A.paper(240,446,40,30,-6)+A.sticky(380,452,24,'#ff2d95',8,'!');
  s+=A.banner(96,6,70,'HOLLIS',A.BOOKC[7],13);
  return s},
  hot:{clock:HS(424,98,112,112,'The clock'),shelves:HS(250,80,190,270,'Bookshelf'),cabinet:HS(770,372,150,160,'Card catalog'),mug:HS(322,412,70,56,'A mug'),window:HS(60,90,150,280,'Window'),plant:HS(10,430,110,130,'Plant')}};

SCENES.lab={bgc:'#cfe8ef',draw(){
  let s=A.r(0,0,960,520,'#cfe8ef',{sw:0})+A.r(0,0,960,520,'url(#p-grid)',{sw:0});
  for(let i=0;i<5;i++)s+=A.l(0,60+i*28,960,60+i*28,{sw:2,s:'rgba(26,16,51,.08)'});
  s+=A.floorWood(520,200,'#c99a67','#b88a58');
  s+=A.chalk(70,90,300,200,`<text x="90" y="130" font-size="26">THE BRAIN, 1943:</text><text x="90" y="165" font-size="26">in1 + in2 &gt;= 2 ?</text><text x="90" y="200" font-size="26">  fire! : stay quiet</text><circle cx="130" cy="250" r="14" fill="none" stroke="#f4ecd8" stroke-width="3"/><circle cx="200" cy="250" r="14" fill="none" stroke="#f4ecd8" stroke-width="3"/><circle cx="290" cy="250" r="18" fill="none" stroke="#ffd92e" stroke-width="3"/><path d="M144 250h30M214 250h56" stroke="#f4ecd8" stroke-width="3"/>`);
  s+=A.r(430,56,210,150,'#c99a67',{r:6})+A.r(440,66,190,130,'#e8c28a',{r:3,sw:3})+A.sticky(450,76,48,'#ffd92e',-6,'tokens')+A.sticky(510,80,48,'#ff2d95',5,'embed')+A.sticky(570,76,48,'#36d65a',-3,'attn')+A.sticky(462,138,48,'#2f8cff',4,'RAG')+A.sticky(530,140,48,'#ff8a1f',-7,'dice')+A.l(480,110,540,150,{sw:2,s:'#d4004f'})+A.l(540,150,595,100,{sw:2,s:'#d4004f'});
  s+=A.rack(770,70,140,330);
  s+=A.r(80,420,820,110,'#e8dcc0',{r:6})+A.r(70,404,840,26,'#f4ecd8',{r:6});
  s+=A.crt(300,300,120,110,'#12301f',`<text x="14" y="28" font-family="VT323" font-size="20" fill="#7dffa0">&gt; hello_</text><text x="14" y="52" font-family="VT323" font-size="20" fill="#7dffa0">tokens: 12</text>`,{stand:false});
  s+=A.crt(450,290,150,120,'#12301f',`<text x="14" y="30" font-family="VT323" font-size="22" fill="#7dffa0">p(next)</text>${[0,1,2,3].map(i=>`<rect x="14" y="${40+i*17}" width="${90-i*22}" height="10" fill="#7dffa0"/>`).join('')}`,{stand:false});
  s+=A.crt(640,300,120,110,'#2a1a52',`<text x="14" y="34" font-family="VT323" font-size="22" fill="#ffd92e">LOADING...</text><rect x="14" y="48" width="80" height="12" fill="none" stroke="#ffd92e" stroke-width="2"/><rect x="16" y="50" width="48" height="8" fill="#ffd92e"/>`,{stand:false});
  s+=A.p('M0 480 q120 70 250 10 t300 30 t240 -10','none',{sw:7,s:'#ff2d95'})+A.p('M0 500 q140 60 270 0 t300 40','none',{sw:7,s:'#2f8cff'});
  s+=A.mug(120,380,'#ffd92e')+A.plant(880,540,.9)+A.crate(20,470,80,70,'DISKS');
  return s},
  hot:{rack:HS(770,70,140,330,'Server rack'),board:HS(70,90,300,200,'Chalkboard'),monitors:HS(300,290,460,130,'Monitors'),cork:HS(430,56,210,150,'Sticky notes')}};

SCENES.office={bgc:'#2b1b6e',draw(){
  let s=A.r(0,0,960,520,'#d9c9a3',{sw:0});
  s+=A.r(0,0,960,520,'url(#p-stripe)',{sw:0});
  s+=A.win(250,50,460,320,{sky:'url(#g-dusk)',inner:A.skyline(250,170,460,200)+A.e(560,150,30,30,'#fff4b8',{sw:0,s:'none'})+`<g fill="#fff">${[0,1,2,3,4,5,6].map(i=>`<circle cx="${270+i*62}" cy="${70+(i*37)%50}" r="2"/>`).join('')}</g>`,frame:'#5a3a22'});
  s+=A.p('M200 40 q60 10 60 120 q0 120 -20 230 h-90 q20 -110 20 -230 q0 -80 30 -120z','#8b2a4a',{sw:4})+A.p('M760 40 q-60 10 -60 120 q0 120 20 230 h90 q-20 -110 -20 -230 q0 -80 -30 -120z','#8b2a4a',{sw:4});
  s+=A.r(40,120,110,140,'#fff',{sw:5})+A.r(52,132,86,116,'#fffdf4',{sw:3})+A.t(95,165,'J.D.',{fs:20})+A.l(64,185,126,185,{sw:2})+A.l(64,200,126,200,{sw:2})+A.e(95,230,10,10,'#d4004f',{sw:3});
  s+=A.shelf(790,100,150,270,9,4)+A.r(0,372,960,148,'#6e4526',{sw:0})+A.l(0,372,960,372,{sw:5});
  s+=A.floorWood(520,200,'#7a4a26','#6a3e1e');
  s+=A.rug(260,566,440,110,'#2b3a67');
  s+=A.desk(170,440,620,100,'#7a4a26')+A.scales(260,430,.9)+A.folder(480,418,110,60,'#ffd92e','TOLLIVER')+A.r(630,420,70,34,'#222',{r:6})+A.r(640,408,50,16,'#333',{r:5})+A.paper(350,430,50,36,5);
  return s},
  hot:{phone:HS(630,404,70,50,'Phone'),skyline:HS(250,50,460,320,'City view'),diploma:HS(40,120,110,140,'Diploma'),folder:HS(480,418,110,60,'Case folder'),scales:HS(210,370,110,90,'Scales')}};

SCENES.archive={bgc:'#5a3a22',draw(){
  let s=A.r(0,0,960,720,'#3a2a20',{sw:0})+A.r(0,0,960,720,'url(#p-dith)',{sw:0});
  // aisle floor in perspective
  s+=A.p('M330 300 L630 300 L960 720 L0 720Z','#a87c4f',{sw:4});
  for(let i=1;i<6;i++){const y=300+i*i*13;s+=A.l(330-(y-300)*.45,y,630+(y-300)*.45,y,{sw:2,s:'rgba(26,16,51,.35)'})}
  // left and right shelving in perspective
  const side=(left)=>{let o='';for(let k=0;k<6;k++){const t=k/6,u=(k+1)/6;const x0=left?0+t*330:960-t*330,x1=left?0+u*330:960-u*330;
    const h0=720-t*410,h1=720-u*410;const top0=(720-h0)/2-20,top1=(720-h1)/2-20;
    o+=A.p(`M${x0} ${top0} L${x1} ${top1} L${x1} ${top1+h1} L${x0} ${top0+h0}Z`,k%2?'#8a5a30':'#9a6a3f',{sw:3.5});
    for(let r=1;r<5;r++){const f=r/5;o+=A.l(x0,top0+h0*f,x1,top1+h1*f,{sw:2.5,s:'rgba(26,16,51,.55)'})}
    const R=A.rng(k+(left?3:11));for(let r=0;r<5;r++){const bx=(x0+x1)/2,f0=r/5+.03,bh=(h0+h1)/2*.15;o+=A.r(bx-10*(1-t*.5),top0+(h0+h1)/2*0+ (top0+top1)/2-(top0+top1)/2+ (top0+h0*(r/5)+ (top1+h1*(r/5)-top0-h0*(r/5))/2) +bh*.2,20*(1-t*.5),bh*.7,A.BOOKC[Math.floor(R()*9)],{sw:2})}}return o};
  s+=side(true)+side(false);
  s+=A.r(330,300-130,300,130,'#6e4526',{sw:4})+A.r(342,184,276,112,'#4a2a1b',{sw:3})+A.cabinet(360,196,240,90,6,2);
  s+=A.l(480,0,480,120,{sw:3})+A.p('M430 120 h100 l-20 40 h-60z','#ffd92e',{sw:4})+A.e(480,176,70,22,'url(#g-glow)',{sw:0,s:'none'});
  s+=A.l(120,0,120,60,{sw:3})+A.p('M80 60 h80 l-14 30 h-52z','#ffd92e',{sw:4})+A.l(840,0,840,60,{sw:3})+A.p('M800 60 h80 l-14 30 h-52z','#ffd92e',{sw:4});
  s+=A.l(140,160,140,560,{sw:6,s:'#c99a67'})+A.l(190,160,190,560,{sw:6,s:'#c99a67'});for(let i=0;i<9;i++)s+=A.l(140,200+i*42,190,200+i*42,{sw:4,s:'#c99a67'});
  s+=A.crate(780,560,110,90,'MEMOS')+A.crate(700,590,80,60,'M-101');
  return s},
  hot:{ladder:HS(120,160,90,400,'Rolling ladder'),index:HS(342,184,276,112,'Index drawers'),crates:HS(700,560,190,100,'Memo boxes'),lamp:HS(420,100,120,100,'Lamp')}};

SCENES.party={bgc:'#8b4dff',draw(){
  let s=A.r(0,0,960,520,'#6a35d0',{sw:0})+A.r(0,0,960,520,'url(#p-dots)',{sw:0});
  s+=A.r(0,400,960,120,'#552aa8',{sw:0});s+=A.floorTile(520,200,'#ff2d95','#ffd92e',60);
  for(let i=0;i<14;i++){const x=i*70;s+=A.p(`M${x} 0 q35 60 70 0`,'none',{sw:6,s:A.BOOKC[i%9]})}
  s+=A.l(480,0,480,70,{sw:3})+A.e(480,120,46,46,'#d6d2ca',{sw:5})+`<g stroke="rgba(26,16,51,.45)" stroke-width="2.5" fill="none"><path d="M434 120h92M480 74v92M446 88q34 32 68 64M514 88q-34 32 -68 64"/></g>`+A.p('M455 100 l16 -8 M500 130 l14 -6','none',{sw:5,s:'#fff'});
  s+=A.banner(300,56,360,'THE ATTENTION PARTY','#ff2d95',24);
  [[90,300,'#ff2d95'],[160,250,'#2f8cff'],[800,280,'#ffd92e'],[870,330,'#36d65a'],[740,230,'#ff8a1f']].forEach(([x,y,c])=>{s+=A.e(x,y,34,42,c,{sw:4})+A.p(`M${x-5} ${y+42} l5 8 l5 -8z`,c,{sw:3})+A.l(x,y+50,x+ (x<480?20:-20),y+160,{sw:2.5,s:'rgba(26,16,51,.6)'})});
  // tables with place cards
  for(const [x,w] of [[130,200],[630,200]]){s+=A.r(x,430,w,22,'#fff',{r:6})+A.r(x+w/2-12,452,24,70,'#d6d2ca',{r:3})+A.r(x+10,404,60,28,'#ffd92e',{r:3,sw:3})+A.t(x+40,424,'QUERY',{fs:13})+A.r(x+80,404,50,28,'#2f8cff',{r:3,sw:3})+A.t(x+105,424,'KEY',{fs:13,c:'#fff'})+A.r(x+w-60,404,56,28,'#36d65a',{r:3,sw:3})+A.t(x+w-32,424,'VALUE',{fs:12})}
  s+=A.r(420,380,120,150,'#8b4dff',{r:6})+A.t(480,420,'PUNCH',{fs:16,c:'#fff'})+A.e(480,470,34,34,'#ff2d95',{sw:4});
  return s},
  hot:{banner:HS(300,56,360,70,'Banner'),disco:HS(430,74,100,100,'Disco ball'),tableL:HS(130,400,200,130,'Name-tag table'),tableR:HS(630,400,200,130,'Backpack table')}};

SCENES.maproom={bgc:'#d9c9a3',draw(){
  let s=A.r(0,0,960,520,'#e3d3ab',{sw:0})+A.r(0,0,960,520,'url(#p-grid)',{sw:0});
  s+=A.r(120,50,720,330,'#fffdf4',{sw:6,r:6});
  // meaning map: clusters
  const cl=[[260,150,'#ff2d95','contracts',5],[470,120,'#ff8a1f','torts',4],[640,170,'#2f8cff','criminal',4],[300,290,'#36d65a','property',4],[560,290,'#8b4dff','trusts',5]];
  cl.forEach(([x,y,c,n,k],ci)=>{s+=A.e(x,y,70,48,c,{sw:3,x:'fill-opacity=".18" stroke-dasharray="8 6"'});const R=A.rng(ci+3);for(let i=0;i<k;i++)s+=A.e(x-44+R()*88,y-28+R()*56,7,7,c,{sw:3});s+=A.t(x,y+68,n,{fs:15,f:'Comic Neue, sans-serif'})});
  s+=A.p('M470 120 L560 290','none',{sw:3,s:'#d4004f',x:'stroke-dasharray="6 5"'});
  s+=A.star(470,120,15,'#ffd92e');
  s+=A.floorWood(520,200,'#b8895a','#a37446');
  s+=A.globe(110,430,52)+A.r(60,470,100,70,'#6e4526',{r:6});
  s+=A.desk(300,470,520,80,'#c99a67')+A.paper(360,450,60,40,-5)+A.paper(560,452,60,40,6)+A.r(700,440,80,26,'#ffd92e',{r:4,sw:3})+A.t(740,459,'RULER',{fs:12});
  s+=A.p('M860 440 l20 -48 l20 48z','#ff2d95',{sw:4})+A.e(880,452,14,6,'#6e4526',{sw:3});
  return s},
  hot:{map:HS(120,50,720,330,'Meaning map'),globe:HS(58,376,104,170,'Globe'),ruler:HS(700,440,80,40,'Ruler'),star:HS(440,92,60,60,'Star pin')}};

SCENES.arcade={bgc:'#15103a',draw(){
  let s=A.r(0,0,960,720,'url(#g-night)',{sw:0});
  for(let i=0;i<40;i++){const R=A.rng(i+2);s+=`<rect x="${R()*960}" y="${R()*400}" width="3" height="3" fill="#fff" opacity="${.3+R()*.7}"/>`}
  s+=A.r(0,500,960,220,'#241a5e',{sw:0})+A.l(0,500,960,500,{sw:5});for(let i=0;i<12;i++)s+=A.p(`M${i*90} 520 l30 -16 l30 16 l-30 16z`,'#4a3d94',{sw:2.5});
  s+=A.t(480,80,'LOADED DICE',{fs:56,c:'#ffd92e',sk:'#ff2d95',skw:8});s+=A.t(480,124,'ROLL · SAMPLE · REPEAT',{fs:20,c:'#fff'});
  // dice machine
  s+=A.r(380,160,200,360,'#d4004f',{r:14})+A.r(396,176,168,150,'#12301f',{r:10})+A.r(396,176,168,150,'url(#p-scan)',{sw:0,r:10});
  s+=A.die(430,210,64,5)+A.die(500,236,48,3)+`<text x="480" y="312" font-family="VT323" font-size="24" fill="#7dffa0" text-anchor="middle">p = 0.42</text>`;
  s+=A.e(440,370,24,24,'#ffd92e',{sw:4})+A.e(520,370,24,24,'#36d65a',{sw:4})+A.r(420,420,120,44,'#1a1033',{r:6})+A.t(480,452,'INSERT TOKEN',{fs:14,c:'#ffd92e'});
  // side cabinets
  s+=A.r(130,260,170,260,'#2f8cff',{r:14})+A.r(146,276,138,120,'#12301f',{r:8})+A.t(215,350,'T = 0.2',{fs:26,c:'#7dffa0',f:'VT323, monospace'})+A.e(200,430,18,18,'#ff2d95',{sw:4});
  s+=A.r(660,260,170,260,'#36d65a',{r:14})+A.r(676,276,138,120,'#12301f',{r:8})+A.t(745,350,'T = 1.8',{fs:26,c:'#ffd92e',f:'VT323, monospace'})+A.e(760,430,18,18,'#ff8a1f',{sw:4});
  s+=A.crate(40,470,70,60,'')+A.die(52,440,40,6)+A.die(844,468,50,2);
  return s},
  hot:{machine:HS(380,160,200,360,'The big machine'),cold:HS(130,260,170,260,'Cold cabinet'),hot:HS(660,260,170,260,'Hot cabinet'),sign:HS(260,40,440,100,'Neon sign')}};

SCENES.gym={bgc:'#e8f6ff',draw(){
  let s=A.r(0,0,960,520,'#dff3ff',{sw:0})+A.r(0,0,960,520,'url(#p-stripe)',{sw:0});
  s+=A.floorWood(520,200,'#e2a86a','#d4955a');
  s+=A.r(300,50,360,150,'#222',{r:8})+A.r(310,60,340,130,'#12301f',{r:4})+A.t(480,105,'LOSS 1.69',{fs:40,c:'#7dffa0',f:'VT323, monospace'})+A.t(480,160,'steps: 300,000',{fs:26,c:'#ffd92e',f:'VT323, monospace'});
  s+=A.poster(60,70,150,110,'20 TOKENS|PER PARAMETER',A.BOOKC[2],{fs:16,rot:-3})+A.poster(750,80,150,100,'DOUBLE BOTH!|(model + data)',A.BOOKC[0],{fs:16,c:'#fff',rot:3});
  // barbell made of book stacks
  s+=A.l(150,430,810,430,{sw:10,s:'#555'});
  const st=(x,h,c)=>A.r(x,430-h/2,40,h,c,{r:6});s+=st(130,150,'#ff2d95')+st(176,110,'#ff8a1f')+st(760,120,'#2f8cff')+st(714,170,'#8b4dff');
  s+=A.t(150,500,'MODEL SIZE',{fs:14})+A.t(740,500,'DATA SIZE',{fs:14});
  s+=A.e(300,520,34,12,'#8a8494',{sw:4})+A.r(280,500,40,20,'#8a8494',{r:4,sw:4});
  s+=A.rug(380,570,220,90,'#2f8cff');
  return s},
  hot:{score:HS(300,50,360,150,'Scoreboard'),bar:HS(120,330,700,200,'Barbell'),p1:HS(60,70,150,110,'Poster'),p2:HS(750,80,150,100,'Poster')}};

SCENES.kitchen={bgc:'#e8e8ee',draw(){
  let s=A.r(0,0,960,520,'#f0f0f5',{sw:0});for(let y=0;y<400;y+=40)for(let x=0;x<960;x+=40)s+=`<rect x="${x}" y="${y}" width="40" height="40" fill="none" stroke="rgba(26,16,51,.14)" stroke-width="2"/>`;
  s+=A.floorTile(520,200,'#8a8494','#d6d2ca',60);
  // pass-through window with street view + Dash spot
  s+=A.r(560,70,340,250,'#4a4a60',{r:10})+A.r(574,84,312,222,'url(#g-sky)',{sw:4})+A.r(574,230,312,76,'#7a7a8a',{sw:0})+A.l(574,230,886,230,{sw:4})+A.p('M574 306 h312 v-20 h-312z','#6a6a7a',{sw:0});
  s+=A.r(540,300,380,34,'#c9c9d4',{r:6})+A.r(554,290,352,14,'#e8e8f0',{r:4,sw:3});
  // order rail
  s+=A.r(120,70,360,24,'#8a8494',{r:6});for(let i=0;i<5;i++)s+=A.l(160+i*64,94,160+i*64,110,{sw:2})+A.r(138+i*64,108,44,64,'#fff',{r:3,sw:3,x:`transform="rotate(${[-4,3,-2,5,-5][i]} ${160+i*64} 140)"`})+A.l(146+i*64,126,176+i*64,126,{sw:2,s:'#8a8494'})+A.l(146+i*64,138,170+i*64,138,{sw:2,s:'#8a8494'});
  s+=A.t(300,56,'ORDER SLIPS',{fs:16});
  // hanging pans
  for(let i=0;i<4;i++){const x=150+i*90;s+=A.l(x,200,x,230,{sw:3})+A.e(x,258,28,10,'#555',{sw:3.5})+A.l(x+28,258,x+58,246,{sw:6,s:'#333'})}
  // stove + counter
  s+=A.r(80,360,470,170,'#9ea0ae',{r:6})+A.r(70,344,490,24,'#c9c9d4',{r:6})+A.e(170,336,44,12,'#222',{sw:4})+A.e(290,336,44,12,'#222',{sw:4})+A.e(410,336,44,12,'#222',{sw:4});
  s+=A.r(130,270,80,64,'#d4004f',{r:8})+A.r(122,262,96,14,'#e8704f',{r:6})+A.p('M150 250 q-6 -14 4 -22 M180 250 q-6 -14 4 -22','none',{sw:3,s:'rgba(26,16,51,.4)'});
  s+=A.r(120,430,340,12,'#6a6a7a',{sw:0})+A.r(100,380,60,40,'#ffd92e',{r:4})+A.r(180,384,60,36,'#36d65a',{r:4})+A.e(330,404,26,16,'#ff8a1f',{sw:3.5});
  s+=A.r(600,360,300,120,'#9ea0ae',{r:6});
  return s},
  hot:{rail:HS(120,56,360,130,'Order rail'),window:HS(560,70,340,250,'Pass-through window'),pot:HS(120,250,100,90,'Pot'),pans:HS(120,200,300,70,'Pans')}};

SCENES.brickshop={bgc:'#ffe2c6',draw(){
  let s=A.r(0,0,960,520,'#fff0d8',{sw:0})+A.r(0,0,960,520,'url(#p-dots)',{sw:0});
  s+=A.floorWood(520,200,'#c99a67','#b88a58');
  s+=A.banner(330,10,300,'TOKEN WORKS',A.BOOKC[0],26);
  // pegboard
  s+=A.r(40,90,260,200,'#c99a67',{r:6});for(let y=110;y<280;y+=24)for(let x=60;x<290;x+=24)s+=A.e(x,y,3,3,'#6e4526',{sw:0});
  s+=A.p('M80 130 l60 60 M200 120 v90 M240 150 l30 60','none',{sw:7,s:'#8a8494'})+A.r(70,220,60,16,'#ff8a1f',{r:3})+A.r(160,226,70,12,'#2f8cff',{r:3});
  // bins of bricks
  const bins=[['#ff2d95','the'],['#2f8cff','court'],['#ffd92e','ing'],['#36d65a','tion']];
  bins.forEach(([c,t],i)=>{const x=60+i*112;s+=A.p(`M${x} 330 h100 l-10 100 h-80z`,'#c99a67',{sw:4});for(let k=0;k<5;k++)s+=A.brick(x+14+(k%3)*26,324-Math.floor(k/3)*16,24,14,c,1);s+=A.t(x+50,404,t,{fs:16,f:'VT323, monospace'})});
  // conveyor + chopper
  s+=A.r(560,400,340,36,'#555',{r:10})+Array.from({length:9},(_,i)=>A.l(570+i*37,402,570+i*37,434,{sw:2,s:'#777'})).join('')+A.e(580,440,16,16,'#8a8494',{sw:4})+A.e(880,440,16,16,'#8a8494',{sw:4});
  s+=A.brick(590,368,150,30,'#8b4dff',4);
  s+=A.r(700,250,16,150,'#8a8494',{r:4})+A.r(660,240,100,22,'#d4004f',{r:6})+A.p('M672 262 h76 l-10 56 h-56z','#e8e8f0',{sw:4});
  s+=A.brick(790,380,48,22,'#8b4dff',1)+A.brick(850,380,48,22,'#8b4dff',1);
  s+=A.rug(330,560,300,100,'#2aa7a0');
  return s},
  hot:{bins:HS(50,310,460,130,'Brick bins'),chopper:HS(650,230,120,170,'Chopper'),belt:HS(560,360,340,80,'Conveyor'),peg:HS(40,90,260,200,'Pegboard')}};

SCENES.classroom={bgc:'#cfe8ef',draw(){
  let s=A.r(0,0,960,520,'#d8ecd0',{sw:0})+A.floorWood(520,200,'#c99a67','#b88a58');
  s+=A.chalk(190,70,580,260,`<text x="220" y="125" font-size="30">Q: Roger has 5 balls.</text><text x="220" y="160" font-size="30">He buys 2 cans of 3.</text><text x="220" y="215" font-size="30" fill="#ffd92e">5 + 2x3 = 5 + 6</text><text x="220" y="260" font-size="30" fill="#7dffa0">answer: 11</text>`);
  s+=A.clock(880,90,34,1,0)+A.poster(40,110,110,150,'SHOW|YOUR|WORK!',A.BOOKC[2],{fs:20,rot:-4});
  for(const x of [160,430,700]){s+=A.r(x,420,150,16,'#c99a67',{r:4})+A.l(x+14,436,x+14,520,{sw:5})+A.l(x+136,436,x+136,520,{sw:5})}
  s+=A.e(520,408,16,16,'#d4004f',{sw:4})+A.p('M520 392 q4 -12 14 -12','none',{sw:3.5,s:'#2ab84a'});
  s+=A.globe(850,430,40)+A.plant(60,560,.9);
  return s},
  hot:{board:HS(190,70,580,260,'Chalkboard'),apple:HS(496,388,48,44,'An apple'),poster:HS(40,110,110,150,'Poster'),globe:HS(808,380,84,110,'Globe')}};

SCENES.court={bgc:'#5a3a22',draw(){
  let s=A.r(0,0,960,520,'#8a5a30',{sw:0});for(let x=0;x<960;x+=96)s+=A.r(x+6,20,84,330,'#9a6a3f',{r:6,sw:3.5});
  s+=A.floorWood(520,200,'#7a4a26','#6a3e1e');
  s+=A.e(480,150,70,70,'#ffd92e',{sw:6})+A.e(480,150,52,52,'#fff4b8',{sw:3})+A.scales(480,184,.52);
  s+=A.r(300,250,360,120,'#6e4526',{r:8})+A.r(280,236,400,26,'#c99a67',{r:6})+A.r(300,370,360,16,'#4a2a1b',{sw:0});
  s+=A.l(150,40,150,300,{sw:6,s:'#c99a67'})+A.p('M150 50 h110 l-10 50 l-20 -12 l-20 14 l-20 -14 l-20 12z','#2f8cff',{sw:4})+A.l(810,40,810,300,{sw:6,s:'#c99a67'})+A.p('M810 50 h-110 l10 50 l20 -12 l20 14 l20 -14 l20 12z','#d4004f',{sw:4});
  s+=A.r(70,430,320,100,'#9a6a3f',{r:6})+A.r(570,430,320,100,'#9a6a3f',{r:6})+A.r(70,410,320,26,'#c99a67',{r:6})+A.r(570,410,320,26,'#c99a67',{r:6});
  s+=A.paper(320,226,50,34,-4)+A.mug(580,208)+A.folder(400,222,80,40,'#ffd92e','FILE');
  return s},
  hot:{seal:HS(410,80,140,140,'Court seal'),bench:HS(280,236,400,150,'The bench'),flagL:HS(110,40,160,260,'Flag'),flagR:HS(690,40,160,260,'Flag')}};

SCENES.night={bgc:'#0d0a24',draw(){let s=A.r(0,0,960,720,'url(#g-night)',{sw:0});for(let i=0;i<60;i++){const R=A.rng(i+5);s+=`<rect x="${R()*960}" y="${R()*520}" width="${R()>.8?4:3}" height="${R()>.8?4:3}" fill="#fff" opacity="${.3+R()*.7}"/>`}return s+A.skyline(0,380,960,340)},hot:{}};

function sceneSVG(name){const sc=SCENES[name]||SCENES.lobby;return `<svg viewBox="0 0 960 720" preserveAspectRatio="xMidYMid slice" xmlns="${NS}" role="img" aria-label="${esc(name)} scene">${sc.draw()}</svg>`}
