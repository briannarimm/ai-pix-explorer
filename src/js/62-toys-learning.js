/* ==== TOYS for Level 1: Neuron Gate, Weight Tuner, Code Cracker ==== */

/* ---------- Neuron Gate: McCulloch-Pitts threshold logic ---------- */
TOYS.neuron={title:'Neuron Gate',short:'Neuron Gate',level:1,ord:1,color:'var(--lemon)',tb1:'var(--lemon)',tb2:'var(--tang)',icon:ICONS.neuron,
  help:'A neuron fires if more than θ excitatory inputs fire and no inhibitory input is on (McCulloch & Pitts, 1943/2021).',
  html:`<div class="canvas" style="display:grid;gap:12px">
    <div class="row" style="justify-content:space-between;align-items:baseline"><h3 class="lab-title">Build a 1943 neuron</h3><span class="tip">All-or-none switches. No numbers between 0 and 1.</span></div>
    <div class="row" id="nrSw"></div>
    <div class="scroll-x"><svg id="nrSvg" viewBox="0 0 460 230" style="width:100%;min-width:380px;height:auto;display:block" role="img" aria-label="A threshold neuron with three excitatory inputs and one inhibitory input"></svg></div>
    <label class="slider-row"><span>Threshold θ</span><input type="range" id="nrTh" min="0" max="3" step="1" value="1"><output id="nrThO">1</output></label>
    <div class="live" id="nrLive"></div>
    <div class="row"><span class="label">Presets</span><button class="btn small lemon" type="button" data-th="0">OR (any one)</button><button class="btn small lemon" type="button" data-th="1">Majority</button><button class="btn small lemon" type="button" data-th="2">AND (all three)</button><button class="btn small sky" type="button" id="nrCheck">Check my gate</button></div>
    <p id="nrGate" style="font-size:16px"></p>
    <div class="scroll-x"><table class="att-tbl" id="nrTbl" style="min-width:420px"></table></div>
  </div>
  <div class="canvas" style="display:grid;gap:10px">
    <h3 class="lab-title">One neuron cannot do XOR. Two can.</h3>
    <p style="font-size:16px">XOR means "one or the other, but not both." A single threshold neuron cannot compute it. Put a second neuron in front, make it veto the first one, and it works. Flip A and B.</p>
    <div class="row" id="nrXsw"></div>
    <div class="scroll-x"><svg id="nrXSvg" viewBox="0 0 460 190" style="width:100%;min-width:380px;height:auto;display:block" role="img" aria-label="Two neurons computing XOR"></svg></div>
    <div class="scroll-x"><table class="att-tbl" id="nrXTbl" style="min-width:380px"></table></div>
  </div>`,
  init(){
    const st={A:1,B:1,C:0,I:0,th:1,XA:0,XB:1};
    const fires=(ex,inh,th)=>ex>th&&!inh;
    const sw=$('#nrSw');
    const mk=(k,lab,cls)=>{const b=h('button.btn'+(cls||''),{type:'button',style:{minWidth:'64px'},'aria-pressed':String(!!st[k]),onclick:()=>{st[k]=st[k]?0:1;draw()},'data-hint':k==='I'?'The inhibitory input. If it is on, the neuron cannot fire.':'An excitatory input. Click to switch it on or off.'},lab);b.dataset.k=k;return b};
    ['A','B','C'].forEach(k=>sw.appendChild(mk(k,'Input '+k+': off')));sw.appendChild(mk('I','Inhibit: off',' pink'));
    $('#nrTh').addEventListener('input',e=>{st.th=+e.target.value;draw()});
    $$('[data-th]',$('#toy-neuron')).forEach(b=>b.onclick=()=>{st.th=+b.dataset.th;$('#nrTh').value=st.th;draw()});
    const gname=th=>({0:'OR: fires when at least one input is on',1:'Majority: fires when two or three inputs are on',2:'AND: fires only when all three inputs are on',3:'Never fires: the threshold is higher than the number of inputs'})[th];
    $('#nrCheck').onclick=()=>{const th=st.th;$('#nrGate').innerHTML=`<b>Your gate:</b> ${gname(th)}. ${th===2?'That is the hardest one to hit by accident, nicely done.':'Try θ = 2 to build AND.'}`;SND.play(th===2?'ok':'click')};
    const drawX=()=>{
      const xa=st.XA,xb=st.XB;const n1=fires(xa+xb,0,1),n2=fires(xa+xb,n1,0);
      const svg=$('#nrXSvg');svg.innerHTML='';
      const line=(x1,y1,x2,y2,on)=>el('path',{d:`M${x1} ${y1} L${x2} ${y2}`,stroke:on?C.pink:'#8a8494','stroke-width':on?5:3,fill:'none'},svg);
      line(70,50,190,50,xa);line(70,50,190,140,xa);line(70,140,190,50,xb);line(70,140,190,140,xb);
      line(250,50,330,95,n1);line(250,140,330,95,n2);
      // veto from N1 to N2
      el('path',{d:'M220 80 L220 110',stroke:n1?C.pink:'#8a8494','stroke-width':n1?5:3,fill:'none'},svg);el('circle',{cx:220,cy:114,r:7,fill:n1?C.pink:'#fff',stroke:C.ink,'stroke-width':2.5},svg);
      [['A',50,xa],['B',140,xb]].forEach(([n,y,v])=>{el('circle',{cx:52,cy:y,r:20,fill:v?C.lemon:'#fff',stroke:C.ink,'stroke-width':3},svg);const t=el('text',{x:52,y:y+6,'text-anchor':'middle','font-family':'Bungee','font-size':16,fill:C.ink},svg);t.textContent=n});
      [['N1 · θ=1',50,n1],['N2 · θ=0',140,n2]].forEach(([n,y,v])=>{el('path',{d:`M190 ${y-30} L250 ${y} L190 ${y+30}Z`,fill:v?C.lemon:C.paper,stroke:C.ink,'stroke-width':3.5,'stroke-linejoin':'round'},svg);const t=el('text',{x:205,y:y+4,'font-family':'Comic Neue','font-size':11,'font-weight':700,fill:C.ink},svg);t.textContent=n.split(' ')[0]});
      el('circle',{cx:350,cy:95,r:24,fill:n2?C.lime:'#fff',stroke:C.ink,'stroke-width':4},svg);const lt=el('text',{x:350,y:101,'text-anchor':'middle','font-family':'Bungee','font-size':14,fill:C.ink},svg);lt.textContent=n2?'1':'0';
      const t2=el('text',{x:395,y:100,'font-family':'Comic Neue','font-size':14,'font-weight':700,fill:C.ink},svg);t2.textContent='XOR';
      const t3=el('text',{x:150,y:182,'text-anchor':'middle','font-family':'Comic Neue','font-size':12,fill:C.ink},svg);t3.textContent='N1 = AND(A,B) vetoes N2 = OR(A,B)';
      let h2='<thead><tr><th>A</th><th>B</th><th>N1 (A and B)</th><th>N2 output</th></tr></thead><tbody>';
      for(const a of[0,1])for(const b of[0,1]){const m=fires(a+b,0,1),o=fires(a+b,m,0);h2+=`<tr class="${a===xa&&b===xb?'top':''}"><td>${a}</td><td>${b}</td><td>${m?1:0}</td><td><b>${o?1:0}</b></td></tr>`}
      $('#nrXTbl').innerHTML=h2+'</tbody>';
    };
    const xsw=$('#nrXsw');['XA','XB'].forEach((k,i)=>xsw.appendChild(h('button.btn',{type:'button',style:{minWidth:'64px'},onclick:()=>{st[k]=st[k]?0:1;draw()}},(i?'B':'A')+': '+(st[k]?'on':'off'))));
    function draw(){
      $$('[data-k]',sw).forEach(b=>{const k=b.dataset.k;const on=st[k];b.setAttribute('aria-pressed',String(!!on));b.textContent=(k==='I'?'Inhibit: ':'Input '+k+': ')+(on?'ON':'off');b.classList.toggle('lemon',!!on&&k!=='I')});
      $('#nrThO').textContent=st.th;
      const ex=st.A+st.B+st.C,out=fires(ex,st.I,st.th);if(out)award('neuron');
      const svg=$('#nrSvg');svg.innerHTML='';
      const ys=[40,100,160];
      ['A','B','C'].forEach((n,i)=>{const on=st[n];el('path',{d:`M64 ${ys[i]} L180 115`,stroke:on?C.pink:'#8a8494','stroke-width':on?5:3,fill:'none'},svg);
        el('circle',{cx:44,cy:ys[i],r:20,fill:on?C.lemon:'#fff',stroke:C.ink,'stroke-width':3},svg);const t=el('text',{x:44,y:ys[i]+6,'text-anchor':'middle','font-family':'Bungee','font-size':16,fill:C.ink},svg);t.textContent=n});
      el('path',{d:'M215 20 L215 78',stroke:st.I?C.pink:'#8a8494','stroke-width':st.I?5:3,fill:'none'},svg);el('circle',{cx:215,cy:84,r:8,fill:st.I?C.pink:'#fff',stroke:C.ink,'stroke-width':3},svg);
      const it=el('text',{x:228,y:30,'font-family':'Comic Neue','font-size':13,'font-weight':700,fill:C.ink},svg);it.textContent='inhibitory input';
      el('path',{d:'M180 70 L270 115 L180 160Z',fill:out?C.lemon:C.paper,stroke:C.ink,'stroke-width':4,'stroke-linejoin':'round'},svg);
      const tt=el('text',{x:208,y:121,'font-family':'Bungee','font-size':20,fill:C.ink},svg);tt.textContent='θ='+st.th;
      el('path',{d:'M270 115 L350 115',stroke:out?C.lime:'#8a8494','stroke-width':out?7:3,fill:'none'},svg);
      el('circle',{cx:385,cy:115,r:30,fill:out?C.lime:'#fff',stroke:C.ink,'stroke-width':4},svg);if(out)for(let i=0;i<8;i++){const a=i*Math.PI/4;el('path',{d:`M${385+Math.cos(a)*36} ${115+Math.sin(a)*36} L${385+Math.cos(a)*46} ${115+Math.sin(a)*46}`,stroke:C.ink,'stroke-width':3,'stroke-linecap':'round'},svg)}
      const ot=el('text',{x:385,y:122,'text-anchor':'middle','font-family':'Bungee','font-size':20,fill:C.ink},svg);ot.textContent=out?'FIRE':'0';
      $('#nrLive').innerHTML=`Active excitatory inputs: <b>${ex}</b>. Rule: fires only if ${ex} &gt; θ = <b>${st.th}</b> and the inhibitory input is off${st.I?' (it is <b>on</b>, so the neuron is vetoed)':''}. Output: <b>${out?'fires (1)':'quiet (0)'}</b>.`;
      $('#nrGate').innerHTML=`<b>This gate, with the inhibitory input off:</b> ${gname(st.th)}.`;
      let t='<thead><tr><th>A</th><th>B</th><th>C</th><th>fires?</th></tr></thead><tbody>';
      for(let a=0;a<2;a++)for(let b=0;b<2;b++)for(let c=0;c<2;c++){const o=fires(a+b+c,0,st.th);const cur=a===st.A&&b===st.B&&c===st.C;t+=`<tr class="${cur?'top':''}"><td>${a}</td><td>${b}</td><td>${c}</td><td><b>${o?1:0}</b></td></tr>`}
      $('#nrTbl').innerHTML=t+'</tbody>';
      drawX();
      const xs=$$('button',xsw);xs[0].textContent='A: '+(st.XA?'on':'off');xs[1].textContent='B: '+(st.XB?'on':'off');
    }
    draw();
  }};

/* ---------- Weight Tuner: Samuel-style learning from outcomes ---------- */
TOYS.tuner={title:'Weight Tuner',short:'Weight Tuner',level:1,ord:2,color:'var(--tang)',tb1:'var(--tang)',tb2:'var(--pink)',icon:ICONS.tuner,
  help:'A checkers program scores a position as a weighted sum of features. Learning means adjusting the weights from outcomes. Simulated data.',
  html:`<div class="canvas" style="display:grid;gap:12px">
    <div class="row" style="justify-content:space-between;align-items:baseline"><h3 class="lab-title">Tune a checkers program</h3><span class="tip">Simulated positions. 12 for training, 6 held back for testing.</span></div>
    <p style="font-size:16px">Each position is described by four <b>features</b>. The program scores a position as <b>score = w₁·pieces + w₂·kings + w₃·center + w₄·back row</b>. A positive score means "I expect to win." The label says what really happened. Drag the weights, or press <b>Learn</b> and let the program fix its own mistakes.</p>
    <div class="qsl" id="tnW"></div>
    <div class="row"><button class="btn pink" type="button" id="tnLearn">Learn from mistakes (1 pass)</button><button class="btn sky" type="button" id="tnAuto">Learn for 20 passes</button><button class="btn lemon small" type="button" id="tnReset">Reset weights</button></div>
    <div class="stats"><div class="stat"><b id="tnTrain">0/12</b><span>training positions right</span></div><div class="stat"><b id="tnTest">0/6</b><span>test positions right (never trained on)</span></div><div class="stat"><b id="tnPass">0</b><span>learning passes</span></div><div class="stat"><b id="tnErr">0</b><span>mistakes in the last pass</span></div></div>
    <div class="scroll-x"><table class="att-tbl" id="tnTbl" style="min-width:560px"></table></div>
    <div class="live" id="tnLive"></div>
  </div>`,
  init(){
    const FN=['piece lead','king lead','center control','back-row guard'];
    // deterministic synthetic positions. True rule has noise: two labels disagree with the rule, on purpose.
    const R=A.rng(11);const trueW=[1,1.6,.6,.35];
    const mk=n=>Array.from({length:n},()=>{const f=[Math.round((R()*6-3)*2)/2,Math.round((R()*4-2)*2)/2,Math.round((R()*4-2)*2)/2,Math.round((R()*2-1)*2)/2];const s=f.reduce((a,x,i)=>a+x*trueW[i],0);return{f,y:s>0?1:-1,s}});
    let TR=mk(12),TE=mk(6);
    // two noisy training labels (the real world is messy)
    TR[3].y*=-1;TR[8].y*=-1;
    const W0=[0,0,0,0];let w=W0.slice(),b=0,passes=0,lastErr=0;const eta=.25;
    const score=(f)=>f.reduce((a,x,i)=>a+x*w[i],0)+b;
    const right=(S)=>S.filter(p=>score(p.f)*p.y>0).length;
    const box=$('#tnW');
    FN.forEach((n,i)=>{const l=h('label',h('span.qv',h('span',`w${i+1} · ${n}`),h('output',{id:'tnO'+i},'0.0')),h('input',{type:'range',id:'tnS'+i,min:'-3',max:'3',step:'0.1',value:'0','aria-label':'weight for '+n}));box.appendChild(l);
      l.querySelector('input').addEventListener('input',e=>{w[i]=+e.target.value;draw()})});
    function learnPass(){let err=0;TR.forEach(p=>{if(score(p.f)*p.y<=0){err++;p.f.forEach((x,i)=>w[i]+=eta*p.y*x);b+=eta*p.y}});passes++;lastErr=err;return err}
    $('#tnLearn').onclick=()=>{learnPass();draw();SND.play('click')};
    $('#tnAuto').onclick=()=>{for(let k=0;k<20;k++)learnPass();draw();SND.play('ok')};
    $('#tnReset').onclick=()=>{w=W0.slice();b=0;passes=0;lastErr=0;draw()};
    function draw(){
      w=w.map(v=>clamp(v,-3,3));
      FN.forEach((n,i)=>{$('#tnS'+i).value=w[i];$('#tnO'+i).textContent=w[i].toFixed(1)});
      const tr=right(TR),te=right(TE);if(passes>0&&tr>=10)award('weights');
      $('#tnTrain').textContent=tr+'/12';$('#tnTest').textContent=te+'/6';$('#tnPass').textContent=passes;$('#tnErr').textContent=lastErr;
      let t='<thead><tr><th>set</th>'+FN.map(n=>`<th>${n}</th>`).join('')+'<th>score</th><th>program says</th><th>what happened</th><th></th></tr></thead><tbody>';
      [['train',TR],['test',TE]].forEach(([nm,S])=>S.forEach((p,k)=>{const s=score(p.f);const ok=s*p.y>0;t+=`<tr class="${nm==='test'?'self':''}"><td>${nm} ${k+1}</td>${p.f.map(x=>`<td class="ms">${x>0?'+':''}${x.toFixed(1)}</td>`).join('')}<td class="ms">${s.toFixed(2)}</td><td>${s>0?'win':'lose'}</td><td>${p.y>0?'won':'lost'}</td><td>${ok?'✔':'<span style="color:#d4004f">✗</span>'}</td></tr>`}));
      $('#tnTbl').innerHTML=t+'</tbody>';
      $('#tnLive').innerHTML=`Perceptron update for each mistake: <b>w ← w + η · y · f</b> with η = ${eta}. Weights now: [${w.map(v=>v.toFixed(2)).join(', ')}], bias ${b.toFixed(2)}. ${passes?`After ${passes} passes the program gets ${tr} of 12 training positions right and ${te} of 6 held-back ones. The two noisy labels keep training accuracy below 12.`:'Start with all-zero weights: every score is 0, so every position counts as a mistake.'}`;
    }
    draw();
  }};

/* ---------- Code Cracker: letter frequencies, chi-square, hill climbing ---------- */
TOYS.cracker={title:'Code Cracker',short:'Code Cracker',level:1,ord:3,color:'var(--grape)',tb1:'var(--grape)',tb2:'var(--pink)',icon:ICONS.cracker,
  help:'A substitution cipher. Findler (1964) matched letter frequencies; Samuel (1962) described hill-climbing. Both appear here.',
  html:`<div class="canvas" style="display:grid;gap:12px">
    <div class="row" style="justify-content:space-between;align-items:baseline"><h3 class="lab-title">Crack the cipher</h3><span class="tip">Every plain letter was swapped for a different letter. Spaces are left alone.</span></div>
    <div class="ctextbox" id="crCipher"></div>
    <div class="label">Your key: click a cipher letter, then type the plain letter you think it stands for</div>
    <div class="ckeys" id="crKeys"></div>
    <div class="ctextbox plain" id="crPlain" aria-live="polite"></div>
    <div class="stats"><div class="stat"><b id="crChi">0</b><span>chi-square vs English (lower is better)</span></div><div class="stat"><b id="crWords">0</b><span>real words found</span></div><div class="stat"><b id="crSteps">0</b><span>hill-climbing steps</span></div><div class="stat"><b id="crNoise">0%</b><span>noise on the wire</span></div></div>
    <label class="slider-row"><span>Noise on the wire</span><input type="range" id="crNoiseS" min="0" max="30" step="2" value="0"><output id="crNoiseO">0%</output></label>
    <div class="row"><button class="btn lemon" type="button" id="crFreq">Match by frequency</button><button class="btn sky" type="button" id="crClimb">Hill-climb 40 steps</button><button class="btn pink" type="button" id="crSolve">Auto-solve</button><button class="btn small" type="button" id="crReset">Reset key</button></div>
    <div class="scroll-x"><svg id="crChart" viewBox="0 0 680 200" style="width:100%;min-width:560px;height:auto;display:block" role="img" aria-label="Letter frequencies: English versus your decoded text"></svg></div>
    <div class="live" id="crLive"></div>
  </div>`,
  init(){
    const PLAIN='THE COURT HELD THAT A BENEFICIARY WHO ASKS A COURT TO EXPLAIN A TERM IS NOT CONTESTING THE TRUST. THE SETTLOR WANTED HIS CHILD TO BE CARED FOR, AND THE COURT SHOULD READ THE WORDS THE WAY THE SETTLOR MEANT THEM. A READER WHO KNOWS HOW ENGLISH LOOKS CAN FIND THE MEANING EVEN WHEN EVERY LETTER IS DISGUISED. THAT IS HOW MACHINES BEGIN TO LEARN: THEY COUNT WHAT THEY SEE, AND THEY KEEP THE GUESSES THAT FIT THE COUNTS.';
    const ENG={E:12.7,T:9.06,A:8.17,O:7.51,I:6.97,N:6.75,S:6.33,H:6.09,R:5.99,D:4.25,L:4.03,C:2.78,U:2.76,M:2.41,W:2.36,F:2.23,G:2.02,Y:1.97,P:1.93,B:1.49,V:.98,K:.77,J:.15,X:.15,Q:.1,Z:.07};
    const WORDS=new Set('THE OF AND TO A IN IS THAT IT AS FOR WITH WAS ON ARE BY BE THIS AT FROM OR HAD NOT BUT WHAT ALL WERE WHEN WE THERE CAN AN YOUR WHICH THEIR SAID IF DO WILL EACH ABOUT HOW UP OUT THEM THEN SHE MANY SOME SO THESE WOULD OTHER INTO HAS MORE HER TWO LIKE HIM SEE TIME COULD NO MAKE THAN FIRST BEEN ITS WHO NOW PEOPLE MY MADE OVER DID DOWN ONLY WAY FIND USE MAY WATER LONG LITTLE VERY AFTER WORDS CALLED JUST WHERE MOST KNOW COURT TRUST HELD ASKS TERM CHILD CARED SHOULD READ WAY MEANT READER KNOWS ENGLISH LOOKS FIND MEANING EVEN EVERY LETTER HOW MACHINES BEGIN LEARN THEY COUNT SEE AND KEEP GUESSES FIT COUNTS WANTED HIS EXPLAIN BENEFICIARY SETTLOR WORDS DISGUISED CONTESTING WHO LEARN'.split(' '));
    const AL='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // fixed secret key (a permutation with no fixed points)
    const SECRET='QWERTYUIOPASDFGHJKLZXCVBNM';
    const enc=Object.fromEntries([...AL].map((c,i)=>[c,SECRET[i]]));
    const R=A.rng(5);
    const noisyAt=[...PLAIN].map((c,i)=>/[A-Z]/.test(c)?R():2); // fixed noise lottery per letter
    const noiseLet=[...PLAIN].map(()=>AL[Math.floor(R()*26)]);
    let noise=0,guess={},sel=null,steps=0;
    const cipherOf=()=>[...PLAIN].map((c,i)=>{if(!/[A-Z]/.test(c))return c;if(noisyAt[i]<noise/100)return noiseLet[i];return enc[c]}).join('');
    let CT=cipherOf();
    const resetKey=()=>{guess={};[...AL].forEach(c=>guess[c]='·');steps=0};
    const decode=()=>[...CT].map(c=>/[A-Z]/.test(c)?(guess[c]==='·'?'_':guess[c]):c).join('');
    const stats=(txt)=>{const cnt={};let n=0;[...txt].forEach(c=>{if(/[A-Z]/.test(c)){cnt[c]=(cnt[c]||0)+1;n++}});return{cnt,n}};
    const chi=(txt)=>{const {cnt,n}=stats(txt);if(!n)return 0;let x=0;[...AL].forEach(c=>{const e=ENG[c]/100*n;x+=Math.pow((cnt[c]||0)-e,2)/e});return x};
    const BYLEN={};WORDS.forEach(w=>{(BYLEN[w.length]=BYLEN[w.length]||[]).push(w)});
    const near=w=>(BYLEN[w.length]||[]).some(d=>{let x=0;for(let i=0;i<w.length;i++)if(w[i]!==d[i]&&++x>1)return false;return true});
    const words=(txt)=>{const ws=txt.replace(/[^A-Z_ ]/g,' ').split(/\s+/).filter(Boolean);let hit=0,close=0;ws.forEach(w=>{if(WORDS.has(w))hit++;else if(w.length>2&&!w.includes('_')&&near(w))close++});return{hit,close,all:ws.length}};
    const fullGuess=()=>{ // fill any missing letters arbitrarily so we can score a complete key
      const used=new Set(Object.values(guess).filter(v=>v!=='·'));const free=[...AL].filter(c=>!used.has(c));const g={...guess};[...AL].forEach(c=>{if(g[c]==='·')g[c]=free.shift()});return g};
    const decodeWith=(g)=>[...CT].map(c=>/[A-Z]/.test(c)?g[c]:c).join('');
    const BIG=new Set('TH HE IN ER AN RE ON AT EN ND ST TO ES OR IS IT NT HA OU EA TI AS TE ET NG OF AL DE SE LE SA SI AR VE RA'.split(' '));
    const scoreKey=(g)=>{const t=decodeWith(g);let bg=0;const ws=t.split(/[^A-Z]+/);ws.forEach(w=>{for(let i=0;i<w.length-1;i++)if(BIG.has(w[i]+w[i+1]))bg++});const wd=words(t);return wd.hit*10+wd.close*5+bg*.6-chi(t)*.15};
    const keys=$('#crKeys');
    function drawKeys(){keys.innerHTML='';const {cnt}=stats(CT);
      [...AL].forEach(c=>{const b=h('button.ckey'+(sel===c?'.sel':''),{type:'button',onclick:()=>{sel=c;drawKeys()},'aria-label':`cipher letter ${c} currently guessed as ${guess[c]}`},h('i',c),h('b',guess[c]),h('small',String(cnt[c]||0)));keys.appendChild(b)});}
    document.addEventListener('keydown',e=>{if(!sel||!$('#toy-cracker')||$('#toy-cracker').hidden)return;const k=e.key.toUpperCase();if(/^[A-Z]$/.test(k)&&e.key.length===1&&!e.ctrlKey&&!e.metaKey){e.preventDefault();e.stopPropagation();
      const prev=Object.keys(guess).find(c=>guess[c]===k);if(prev&&prev!==sel)guess[prev]=guess[sel];guess[sel]=k;draw()}
      if(e.key==='Backspace'&&sel){guess[sel]='·';draw()}},true);
    function climb(n,SR=R){let g=fullGuess();let s=scoreKey(g);const cs=[...AL];
      for(let i=0;i<n;i++){const a=cs[Math.floor(SR()*26)],b=cs[Math.floor(SR()*26)];if(a===b)continue;const g2={...g};const t=g2[a];g2[a]=g2[b];g2[b]=t;const s2=scoreKey(g2);if(s2>s){g=g2;s=s2}steps++}
      guess=g;return s}
    function freqGuess(){const {cnt}=stats(CT);const cl=[...AL].sort((a,b)=>(cnt[b]||0)-(cnt[a]||0));const pl=[...AL].sort((a,b)=>ENG[b]-ENG[a]);cl.forEach((c,i)=>guess[c]=pl[i])}
    $('#crFreq').onclick=()=>{freqGuess();draw();SND.play('click')};
    $('#crClimb').onclick=()=>{climb(40);draw();SND.play('click')};
    $('#crSolve').onclick=()=>{
      const SR=A.rng(7+steps%97);let best=null,bs=-1e9;const total=words(decodeWith(guess)).all||1;
      for(let r=0;r<14;r++){freqGuess();if(r){const cs=[...AL].sort((a,b)=>ENG[b]-ENG[a]).slice(0,12);for(let k=0;k<Math.min(r*2,10);k++){const a=cs[Math.floor(SR()*12)],b=cs[Math.floor(SR()*12)];const t=guess[a];guess[a]=guess[b];guess[b]=t}}
        let sc=0;for(let k=0;k<22;k++)sc=climb(300,SR);if(sc>bs){bs=sc;best={...guess}}
        const bw=words(decodeWith(best));if(bw.hit+bw.close>=.97*total)break}
      guess=best;draw();SND.play('ok')};
    $('#crReset').onclick=()=>{resetKey();sel=null;draw()};
    $('#crNoiseS').addEventListener('input',e=>{noise=+e.target.value;CT=cipherOf();$('#crNoiseO').textContent=noise+'%';resetKey();draw()});
    function chart(){const svg=$('#crChart');svg.innerHTML='';const {cnt,n}=stats(decode().replace(/_/g,' '));const X0=34,W=632,bw=W/26;
      const letters=[...AL].sort((a,b)=>ENG[b]-ENG[a]);const ymax=14;
      for(let v=0;v<=ymax;v+=5){const y=170-v/ymax*150;el('line',{x1:X0,x2:X0+W,y1:y,y2:y,stroke:'#e2ddd0','stroke-width':1},svg);const t=el('text',{x:X0-6,y:y+4,'text-anchor':'end','font-family':'VT323','font-size':15,fill:C.lo},svg);t.textContent=v+'%'}
      letters.forEach((c,i)=>{const x=X0+i*bw;const e=ENG[c];const d=n?(cnt[c]||0)/n*100:0;
        el('rect',{x:x+2,y:170-e/ymax*150,width:bw/2-2,height:e/ymax*150,fill:C.sky,stroke:C.ink,'stroke-width':1.5},svg);
        el('rect',{x:x+bw/2,y:170-Math.min(d,ymax)/ymax*150,width:bw/2-2,height:Math.min(d,ymax)/ymax*150,fill:C.pink,stroke:C.ink,'stroke-width':1.5},svg);
        const t=el('text',{x:x+bw/2,y:188,'text-anchor':'middle','font-family':'Bungee','font-size':11,fill:C.ink},svg);t.textContent=c});
      const lg=el('text',{x:X0+W,y:16,'text-anchor':'end','font-family':'Comic Neue','font-size':13,'font-weight':700,fill:C.ink},svg);lg.innerHTML='<tspan fill="#2f8cff">■</tspan> English  <tspan fill="#ff2d95">■</tspan> your decoded text';
    }
    function draw(){
      $('#crCipher').textContent=CT;
      const pt=decode();const wd=words(pt);
      $('#crPlain').innerHTML=pt.replace(/[A-Z_]+/g,w=>`<span class="${WORDS.has(w)?'ok':''}">${w}</span>`);
      const x=chi(pt.replace(/_/g,' '));if(wd.all&&wd.hit>=.95*wd.all)award('cracker');
      $('#crChi').textContent=x?x.toFixed(0):'0';$('#crWords').textContent=wd.hit+' / '+wd.all;$('#crSteps').textContent=steps;$('#crNoise').textContent=noise+'%';
      drawKeys();chart();
      $('#crLive').innerHTML=`χ² = Σ (observed − expected)² ÷ expected, summed over the 26 letters. It measures how far your decoded letter counts sit from English. <b>Hill-climbing</b> tries swapping two letters and keeps the swap if the score (real words found, minus a small χ² penalty) goes up. It can get stuck on a small peak, so the noise slider matters: Findler (1964) asked how much redundancy a message needs to survive noise.`;
    }
    resetKey();draw();
  }};
