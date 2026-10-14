/* ==== TOY for Level 13: the Tiny Nudge (adversarial example, fast gradient sign method) ==== */
TOYS.nudge={title:'Tiny Nudge',short:'Nudge',level:13,ord:5,color:'var(--pink)',tb1:'var(--pink)',tb2:'var(--tang)',icon:ICONS.nudge,
  help:'A toy linear classifier on a 12 by 12 image. The attack is the single-step method described by Abbas and Wang (2026).',
  html:`<div class="canvas" style="display:grid;gap:12px">
    <div class="row" style="justify-content:space-between;align-items:baseline"><h3 class="lab-title">Flip a confident answer with a small, targeted nudge</h3><span class="tip">Toy classifier: circle or cross</span></div>
    <div class="seg" id="ngBase"><button type="button" data-b="circle" aria-pressed="true">Start from a circle</button><button type="button" data-b="cross" aria-pressed="false">Start from a cross</button></div>
    <div class="nggrid"><figure><canvas id="ngA" width="12" height="12" aria-label="original image"></canvas><figcaption>Original</figcaption><div class="ngbar"><i id="ngPA"></i></div><small id="ngTA"></small></figure>
      <figure><canvas id="ngB" width="12" height="12" aria-label="image after the nudge"></canvas><figcaption>After the nudge</figcaption><div class="ngbar"><i id="ngPB"></i></div><small id="ngTB"></small></figure>
      <figure><canvas id="ngC" width="12" height="12" aria-label="the nudge itself, magnified"></canvas><figcaption>The nudge, magnified</figcaption><small>Gray is no change. Dark and light are the tiny shifts.</small></figure></div>
    <label class="slider-row"><span>Nudge size ε</span><input type="range" id="ngE" min="0" max="0.3" step="0.01" value="0"><output id="ngEo">0.00</output></label>
    <div class="row"><button class="btn pink" type="button" id="ngGo">Nudge it (smart)</button><button class="btn sky" type="button" id="ngRand">Same size, random noise</button><button class="btn lemon small" type="button" id="ngClear">Undo</button></div>
    <div class="live" id="ngLive"></div>
  </div>`,
  init(){
    const N=12,K=N*N;
    const circ=Array.from({length:K},(_,i)=>{const x=i%N-5.5,y=Math.floor(i/N)-5.5,r=Math.hypot(x,y);return Math.abs(r-4)<.9?1:0});
    const cross=Array.from({length:K},(_,i)=>{const x=i%N,y=Math.floor(i/N);return (Math.abs(x-y)<1.2||Math.abs(x+y-11)<1.2)&&x>1&&x<10&&y>1&&y<10?1:0});
    const R=A.rng(31);const eta=Array.from({length:K},()=>R()>.5?1:-1);
    const w=Array.from({length:K},(_,i)=>.6*(circ[i]-cross[i])+.14*eta[i]);
    const clampPix=v=>Math.min(1,Math.max(0,v));
    let base='circle',eps=0,mode='none',x0,x1,b;
    const sg=v=>1/(1+Math.exp(-v));
    function setup(){x0=(base==='circle'?circ:cross).map((v,i)=>.12+.76*v);const dot=x0.reduce((s,v,i)=>s+w[i]*v,0);const target=base==='circle'?3.2:-3.2;b=target-dot}
    const logit=x=>x.reduce((s,v,i)=>s+w[i]*v,0)+b;
    function paint(cv,x,diff){const c=cv.getContext('2d');const im=c.createImageData(N,N);x.forEach((v,i)=>{const g=diff?Math.round(128+v*127):Math.round(255-v*255);im.data.set([g,diff?g:g,diff?g:g,255],i*4)});c.putImageData(im,0,0)}
    function bar(idEl,idTx,z){const p=sg(z);$(idEl).style.width=(p*100)+'%';$(idTx).innerHTML=`P(circle) = <b>${(p*100).toFixed(0)}%</b>, P(cross) = <b>${((1-p)*100).toFixed(0)}%</b> · says <b>${p>=.5?'circle':'cross'}</b>`}
    function draw(){
      let xp=x0.slice(),d=x0.map(()=>0);
      if(mode==='smart'){const s=base==='circle'?-1:1;xp=x0.map((v,i)=>clampPix(v+s*eps*Math.sign(w[i])))}
      else if(mode==='rand'){const R2=A.rng(77);xp=x0.map((v,i)=>clampPix(v+eps*(R2()>.5?1:-1)))}
      d=xp.map((v,i)=>v-x0[i]);const mx=Math.max(.0001,eps);
      paint($('#ngA'),x0);paint($('#ngB'),xp);paint($('#ngC'),d.map(v=>v/mx*.5),true);
      const z0=logit(x0),z1=logit(xp);bar('#ngPA','#ngTA',z0);bar('#ngPB','#ngTB',z1);
      $('#ngEo').textContent=eps.toFixed(2);
      const maxd=Math.max(...d.map(Math.abs));const flipped=(z0>=0)!==(z1>=0);
      $('#ngLive').innerHTML=`Model: z = w · x + b, P(circle) = σ(z). The smart attack moves every pixel by ε in the direction that hurts most: <b>x′ = x ± ε · sign(w)</b>, one step. Largest pixel change: <b>${(maxd*100).toFixed(0)}%</b> of full brightness. Logit z went from <b>${z0.toFixed(2)}</b> to <b>${z1.toFixed(2)}</b>. ${flipped&&mode==='smart'?'<b>The answer flipped.</b> Each pixel moved a little, and 144 little moves add up. Random noise of the same size barely changes z.':mode==='rand'?'Random noise pushes some pixels each way, so the effects mostly cancel.':'Move the slider, then press the smart nudge.'}`;
      if(flipped&&mode==='smart')award('nudge');
    }
    $$('#ngBase button').forEach(bt=>bt.onclick=()=>{base=bt.dataset.b;$$('#ngBase button').forEach(x=>x.setAttribute('aria-pressed',x===bt));mode='none';setup();draw()});
    $('#ngE').addEventListener('input',e=>{eps=+e.target.value;if(mode==='none')mode='smart';draw()});
    $('#ngGo').onclick=()=>{mode='smart';if(eps===0){eps=.12;$('#ngE').value=eps}SND.play('click');draw()};
    $('#ngRand').onclick=()=>{mode='rand';if(eps===0){eps=.12;$('#ngE').value=eps}SND.play('click');draw()};
    $('#ngClear').onclick=()=>{eps=0;mode='none';$('#ngE').value=0;draw()};
    setup();draw();
  }};
