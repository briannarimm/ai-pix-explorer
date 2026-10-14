/* ==== TOYS for Levels 5 and 6: Fill in the Blank (masked vs left-to-right) and the Scaling Explorer ==== */

/* ---------- Fill in the Blank ---------- */
TOYS.mask={title:'Fill in the Blank',short:'Fill in Blank',level:5,ord:1,color:'var(--sky)',tb1:'var(--sky)',tb2:'var(--lime)',icon:ICONS.mask,
  help:'BERT hides 15% of tokens (Devlin et al., 2019). The probabilities below are simulated to show the idea.',
  html:`<div class="canvas" style="display:grid;gap:10px">
    <h3 class="lab-title">The mask machine</h3>
    <p style="font-size:16px">Pretraining needs no human labels. Hide some tokens of real text, then ask the model to guess them. BERT hides <b>15%</b> at random. Slide the dial and re-roll to see what training examples look like.</p>
    <div class="tok-out" id="mkTokens" aria-live="polite"></div>
    <label class="slider-row"><span>Share hidden</span><input type="range" id="mkPct" min="5" max="50" step="5" value="15"><output id="mkPctO">15%</output></label>
    <div class="row"><button class="btn lemon" type="button" id="mkRoll">Re-roll the mask</button><span class="tip" id="mkNote"></span></div>
  </div>
  <div class="canvas" style="display:grid;gap:10px">
    <h3 class="lab-title">Two ways to read: left to right, or both ways</h3>
    <p style="font-size:16px">A GPT-style model predicts the next token, so it sees only the words before the blank. A BERT-style model sees both sides. Pick a sentence, guess the missing word yourself, then compare what each kind of model would say. <b>Simulated probabilities.</b></p>
    <div class="seg" id="mkSeg"></div>
    <div class="prompt-line" id="mkLine"></div>
    <div class="row" id="mkGuess"></div>
    <div id="mkOut" class="two" hidden>
      <div class="canvas" style="display:grid;gap:6px"><span class="label">Left-to-right (sees only the left side)</span><div class="probs" id="mkL"></div></div>
      <div class="canvas" style="display:grid;gap:6px"><span class="label">Both ways (sees both sides)</span><div class="probs" id="mkB"></div></div>
    </div>
    <p id="mkVerdict" style="font-size:16px"></p>
  </div>`,
  init(){
    const SENT=['The beneficiary filed a petition to construe the ambiguous term in the trust.'];
    const toks=SENT[0].replace(/([.,])/g,' $1').split(' ');
    const R0=A.rng(21);let seed=3;
    function roll(){const pct=+$('#mkPct').value;$('#mkPctO').textContent=pct+'%';const R=A.rng(seed);const idx=toks.map((t,i)=>i).filter(i=>/\w/.test(toks[i]));const nmask=Math.max(1,Math.round(idx.length*pct/100));
      const order=idx.map(i=>[R(),i]).sort((a,b)=>a[0]-b[0]).slice(0,nmask).map(x=>x[1]);const M=new Set(order);
      $('#mkTokens').innerHTML=toks.map((t,i)=>M.has(i)?`<span class="tok" style="background:var(--ink);color:#fff">[MASK]</span>`:`<span class="tok" style="background:${TCOL[i%6]}">${esc(t)}</span>`).join('');
      $('#mkNote').textContent=`${nmask} of ${idx.length} words hidden. In BERT's recipe, hidden positions are mostly swapped for [MASK], and the model must recover the original word from the words on both sides.`;}
    const TCOL=[C.pinkL,C.lemonL,C.limeL,C.skyL,C.grapeL,C.tangL];
    $('#mkPct').addEventListener('input',roll);$('#mkRoll').onclick=()=>{seed++;roll()};roll();
    const P=[
      {l:'The beneficiary filed a petition to',r:'the ambiguous term.',ans:'construe',c:[['construe',.10,.62],['dismiss',.24,.02],['compel',.18,.04],['modify',.14,.10],['interpret',.07,.16],['enforce',.12,.03]]},
      {l:'A settlor may',r:'a trust if the instrument reserves that power.',ans:'revoke',c:[['revoke',.18,.58],['create',.30,.04],['amend',.17,.28],['sign',.14,.02],['fund',.12,.03],['sell',.05,.02]]},
      {l:'The court granted the motion because the plaintiff failed to',r:'a claim.',ans:'state',c:[['state',.07,.72],['appear',.31,.01],['respond',.22,.01],['file',.16,.10],['prove',.12,.06],['plead',.06,.10]]},
      {l:'The testator signed the',r:'in front of two witnesses.',ans:'will',c:[['will',.26,.48],['contract',.22,.12],['form',.18,.04],['petition',.14,.03],['codicil',.05,.30],['deed',.09,.03]]}
    ];
    let pi=0,picked=null,corr=0;
    const seg=$('#mkSeg');
    P.forEach((p,i)=>seg.appendChild(h('button',{type:'button','aria-pressed':String(i===0),onclick:()=>{pi=i;picked=null;$$('button',seg).forEach((b,j)=>b.setAttribute('aria-pressed',j===i));draw()}},'Sentence '+(i+1))));
    function bars(el,arr,ans){el.innerHTML='';const tot=arr.reduce((s,x)=>s+x[1],0);arr.slice().sort((a,b)=>b[1]-a[1]).forEach(([w,p])=>{const pc=p/tot*100;el.appendChild(h('div.prob'+(w===ans?'.hit':''),h('span.w',w),h('div.track',h('i',{style:{width:pc+'%'}})),h('span.pct',pc.toFixed(0)+'%')))})}
    function draw(){const p=P[pi];
      $('#mkLine').innerHTML=`${esc(p.l)} <span class="next">${picked?esc(p.ans):'_____'}</span> ${esc(p.r)}`;
      const g=$('#mkGuess');g.innerHTML='';g.appendChild(h('span.label','Your guess:'));
      (()=>{const Rr=A.rng(pi*7+3);return p.c.map((c,i)=>[Rr(),i]).sort((a,b)=>a[0]-b[0]).map(x=>p.c[x[1]])})().forEach(([w])=>g.appendChild(h('button.btn.small'+(picked===w?(w===p.ans?'.lime':'.pink'):''),{type:'button',onclick:()=>{picked=w;if(w===p.ans){corr++;if(corr>=2)award('blank')}SND.play(w===p.ans?'ok':'no');draw()}},w)));
      const out=$('#mkOut');out.hidden=!picked;
      if(picked){bars($('#mkL'),p.c.map(c=>[c[0],c[1]]),p.ans);bars($('#mkB'),p.c.map(c=>[c[0],c[2]]),p.ans);
        const tl=p.c.reduce((s,x)=>s+x[1],0),tb=p.c.reduce((s,x)=>s+x[2],0);const a=p.c.find(c=>c[0]===p.ans);
        $('#mkVerdict').innerHTML=`${picked===p.ans?'<b>You got it.</b> ':`<b>The original word was "${esc(p.ans)}".</b> `}Reading left to right, a model gives it about <b>${(a[1]/tl*100).toFixed(0)}%</b>. Reading both ways, about <b>${(a[2]/tb*100).toFixed(0)}%</b>. The words after the blank carry real information, and only the bidirectional model gets to use them. GPT-style models give that up so they can write text one token at a time {{c:devlin2019,brown2020}}.`.replace(/\{\{c:([^}]+)\}\}/,(_,s)=>citeHTML(s));}
      else $('#mkVerdict').textContent='Pick a word to reveal both models.';
    }
    draw();
  }};

/* ---------- Scaling Explorer ---------- */
TOYS.scaling={title:'Scaling Explorer',short:'Scaling',level:6,ord:1,color:'var(--grape)',tb1:'var(--grape)',tb2:'var(--pink)',icon:ICONS.scaling,
  help:'Loss estimate from the fitted formula in Hoffmann et al. (2022). Dots are real models. Click the map or use the sliders.',
  html:`<div class="canvas" style="display:grid;gap:10px">
    <div class="row" style="justify-content:space-between;align-items:baseline"><h3 class="lab-title">Parameters versus training tokens</h3><span class="tip">Greener = lower estimated loss</span></div>
    <div class="scroll-x"><svg id="scSvg" viewBox="0 0 700 440" style="width:100%;min-width:560px;height:auto;display:block;cursor:crosshair" role="img" aria-label="Map of estimated loss over model size and training tokens"></svg></div>
    <label class="slider-row"><span>Parameters N</span><input type="range" id="scN" min="8" max="12.5" step="0.02" value="10.85"><output id="scNo">70B</output></label>
    <label class="slider-row"><span>Training tokens D</span><input type="range" id="scD" min="9" max="14" step="0.02" value="12.15"><output id="scDo">1.4T</output></label>
    <div class="row"><span class="label">Load a real model</span><button class="btn small lemon" type="button" data-m="gpt3">GPT-3</button><button class="btn small lemon" type="button" data-m="gopher">Gopher</button><button class="btn small pink" type="button" data-m="chin">Chinchilla</button><button class="btn small sky" type="button" data-m="opt">Optimal for 1 billion</button></div>
    <div class="stats"><div class="stat"><b id="scLoss">0</b><span>estimated loss</span></div><div class="stat"><b id="scRatio">0</b><span>tokens per parameter</span></div><div class="stat"><b id="scC">0</b><span>training compute (FLOPs)</span></div><div class="stat"><b id="scPF">0</b><span>petaflop-days</span></div></div>
    <p id="scVerdict" style="font-size:16px"></p>
    <div class="live" id="scLive"></div>
  </div>`,
  init(){
    const E=1.69,Ac=406.4,Bc=410.7,al=.34,be=.28;
    const L=(N,D)=>E+Ac/Math.pow(N,al)+Bc/Math.pow(D,be);
    const FR=[[4e8,8e9],[1e9,20.2e9],[1e10,205.1e9],[67e9,1.5e12],[175e9,3.7e12],[280e9,5.9e12],[520e9,11e12],[1e12,21.2e12]];
    const MODELS={gpt3:['GPT-3',175e9,300e9],gopher:['Gopher',280e9,300e9],chin:['Chinchilla',70e9,1.4e12],lamda:['LaMDA',137e9,168e9],mt:['MT-NLG',530e9,270e9],jur:['Jurassic-1',178e9,300e9]};
    const X0=64,Y0=18,W=616,Hh=360,xl=[8,12.5],yl=[9,14];
    const px=lg=>X0+(lg-xl[0])/(xl[1]-xl[0])*W, py=lg=>Y0+Hh-(lg-yl[0])/(yl[1]-yl[0])*Hh;
    const fmt=v=>v>=1e12?(v/1e12).toFixed(v>=1e13?0:1)+'T':v>=1e9?(v/1e9).toFixed(v>=1e11?0:v>=1e10?0:1)+'B':(v/1e6).toFixed(0)+'M';
    const lo=L(1e12*3,1e14),hi=L(1e8,1e9);
    const col=v=>{const t=clamp((v-1.8)/(3.3-1.8),0,1);const a=[54,214,90],m=[255,244,150],b=[255,45,149];const f=t<.5?[a,m,t*2]:[m,b,(t-.5)*2];return `rgb(${f[0].map((x,i)=>Math.round(x+(f[1][i]-x)*f[2])).join(',')})`};
    const svg=$('#scSvg');
    let lN=10.85,lD=12.15;
    function base(){
      svg.innerHTML='';const nx=56,ny=44,cw=W/nx,ch=Hh/ny;
      for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){const n=xl[0]+(i+.5)/nx*(xl[1]-xl[0]),d=yl[1]-(j+.5)/ny*(yl[1]-yl[0]);el('rect',{x:X0+i*cw,y:Y0+j*ch,width:cw+.6,height:ch+.6,fill:col(L(Math.pow(10,n),Math.pow(10,d)))},svg)}
      el('rect',{x:X0,y:Y0,width:W,height:Hh,fill:'none',stroke:C.ink,'stroke-width':3},svg);
      for(let g=8;g<=12;g++){const t=el('text',{x:px(g),y:Y0+Hh+20,'text-anchor':'middle','font-family':'VT323','font-size':17,fill:C.ink},svg);t.textContent=fmt(Math.pow(10,g));el('line',{x1:px(g),x2:px(g),y1:Y0+Hh,y2:Y0+Hh+5,stroke:C.ink,'stroke-width':2},svg)}
      for(let g=9;g<=14;g++){const t=el('text',{x:X0-8,y:py(g)+5,'text-anchor':'end','font-family':'VT323','font-size':17,fill:C.ink},svg);t.textContent=fmt(Math.pow(10,g));el('line',{x1:X0-5,x2:X0,y1:py(g),y2:py(g),stroke:C.ink,'stroke-width':2},svg)}
      const xt=el('text',{x:X0+W/2,y:Y0+Hh+40,'text-anchor':'middle','font-family':'Bungee','font-size':12,fill:C.ink},svg);xt.textContent='MODEL PARAMETERS (log scale) →';
      const yt=el('text',{x:16,y:Y0+Hh/2,'text-anchor':'middle','font-family':'Bungee','font-size':12,fill:C.ink,transform:`rotate(-90 16 ${Y0+Hh/2})`},svg);yt.textContent='TRAINING TOKENS (log) →';
      // iso-compute lines
      [21,22,23,24,25].forEach(c=>{const a=Math.log10(Math.pow(10,c)/6);const x1=Math.max(xl[0],a-yl[1]),x2=Math.min(xl[1],a-yl[0]);if(x2<=x1)return;
        el('line',{x1:px(x1),y1:py(a-x1),x2:px(x2),y2:py(a-x2),stroke:'rgba(26,16,51,.55)','stroke-width':1.5,'stroke-dasharray':'4 4'},svg);
        const t=el('text',{x:px(x2)-4,y:py(a-x2)-5,'text-anchor':'end','font-family':'VT323','font-size':15,fill:C.ink},svg);t.textContent='10^'+c+' FLOPs'});
      // compute-optimal frontier (Hoffmann et al. Table 3)
      el('path',{d:FR.map((p,i)=>(i?'L':'M')+px(Math.log10(p[0])).toFixed(1)+' '+py(Math.log10(p[1])).toFixed(1)).join(''),fill:'none',stroke:C.ink,'stroke-width':4.5},svg);
      el('path',{d:FR.map((p,i)=>(i?'L':'M')+px(Math.log10(p[0])).toFixed(1)+' '+py(Math.log10(p[1])).toFixed(1)).join(''),fill:'none',stroke:'#fff','stroke-width':2},svg);
      const ft=el('text',{x:px(Math.log10(1.5e10)),y:py(Math.log10(1.5e11))+30,'font-family':'Bungee','font-size':11,fill:C.ink,transform:`rotate(-27 ${px(Math.log10(1.5e10))} ${py(Math.log10(1.5e11))+30})`},svg);ft.textContent='compute-optimal line';
      Object.values(MODELS).forEach(([nm,n,d])=>{el('circle',{cx:px(Math.log10(n)),cy:py(Math.log10(d)),r:6,fill:nm==='Chinchilla'?C.pink:C.lemon,stroke:C.ink,'stroke-width':2.5},svg);const OFF={'GPT-3':[-9,18,'end'],'Jurassic-1':[0,-12,'middle'],'Gopher':[10,-9,'start'],'MT-NLG':[10,17,'start'],'LaMDA':[-9,-8,'end'],'Chinchilla':[12,5,'start']}[nm]||[9,-7,'start'];const t=el('text',{x:px(Math.log10(n))+OFF[0],y:py(Math.log10(d))+OFF[1],'text-anchor':OFF[2],'font-family':'Comic Neue','font-size':13,'font-weight':700,fill:C.ink,'paint-order':'stroke',stroke:'#fffdf4','stroke-width':3},svg);t.textContent=nm});
      el('g',{id:'scCur'},svg);
    }
    function cur(){const g=$('#scCur');g.innerHTML='';const x=px(lN),y=py(lD);
      el('line',{x1:x,x2:x,y1:Y0,y2:Y0+Hh,stroke:C.ink,'stroke-width':1.5,'stroke-dasharray':'3 4'},g);el('line',{x1:X0,x2:X0+W,y1:y,y2:y,stroke:C.ink,'stroke-width':1.5,'stroke-dasharray':'3 4'},g);
      el('circle',{cx:x,cy:y,r:10,fill:'#fff',stroke:C.ink,'stroke-width':4},g);el('circle',{cx:x,cy:y,r:4,fill:C.ink},g);
      const N=Math.pow(10,lN),D=Math.pow(10,lD);const loss=L(N,D),ratio=D/N,comp=6*N*D;
      $('#scNo').textContent=fmt(N);$('#scDo').textContent=fmt(D);$('#scN').value=lN;$('#scD').value=lD;
      $('#scLoss').textContent=loss.toFixed(2);$('#scRatio').textContent=ratio>=10?ratio.toFixed(0):ratio.toFixed(1);$('#scC').textContent=comp.toExponential(1).replace('e+','e');$('#scPF').textContent=(comp/8.64e19).toExponential(1).replace('e+','e');
      $('#scVerdict').innerHTML=ratio<10?`<b>Under-trained for its size.</b> At ${ratio.toFixed(1)} tokens per parameter, extra data would help more than extra parameters. This is where GPT-3 sat: 175 billion parameters on 300 billion tokens, about 1.7 tokens per parameter {{c:hoffmann2022}}.`:ratio>45?`<b>Over-trained for its size.</b> At ${ratio.toFixed(0)} tokens per parameter the model is small for the data. That wastes training compute, though a small model is cheap to run afterward.`:`<b>Near the compute-optimal band.</b> About ${ratio.toFixed(0)} tokens per parameter. The paper's table lands near 20 tokens per parameter {{c:hoffmann2022}}.`;
      $('#scVerdict').innerHTML=$('#scVerdict').innerHTML.replace(/\{\{c:([^}]+)\}\}/,(_,s)=>citeHTML(s));
      $('#scLive').innerHTML=`L(N, D) = ${E} + ${Ac} ÷ N<sup>${al}</sup> + ${Bc} ÷ D<sup>${be}</sup> = ${E} + <b>${(Ac/Math.pow(N,al)).toFixed(3)}</b> + <b>${(Bc/Math.pow(D,be)).toFixed(3)}</b> = <b>${loss.toFixed(3)}</b>. Compute ≈ 6 · N · D = <b>${comp.toExponential(2)}</b> FLOPs. The first constant, ${E}, is the loss no model can beat: it stands for the randomness in natural text.`;
      if(N>=170e9&&N<=180e9)award('bigger');
      if(ratio>=14&&ratio<=30&&N>=1e9)award('balance');
    }
    base();cur();
    $('#scN').addEventListener('input',e=>{lN=+e.target.value;cur()});$('#scD').addEventListener('input',e=>{lD=+e.target.value;cur()});
    $$('[data-m]',$('#toy-scaling')).forEach(b=>b.onclick=()=>{const k=b.dataset.m;if(k==='opt'){lN=9;lD=Math.log10(20.2e9)}else{lN=Math.log10(MODELS[k][1]);lD=Math.log10(MODELS[k][2])}cur()});
    svg.addEventListener('click',e=>{const r=svg.getBoundingClientRect();const sx=700/r.width;const x=(e.clientX-r.left)*sx,y=(e.clientY-r.top)*sx;if(x<X0||x>X0+W||y<Y0||y>Y0+Hh)return;lN=xl[0]+(x-X0)/W*(xl[1]-xl[0]);lD=yl[1]-(y-Y0)/Hh*(yl[1]-yl[0]);cur()});
  }};
