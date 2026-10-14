/* ==== TOY: Loaded Dice (sampling), ported from v1 ==== */
const tNote=T=>Math.abs(T-1)<.001?`Here T = 1.00, and dividing by 1 changes nothing: at the default temperature the logits are used as-is. T is in the formula because it's the knob. Drag the Temperature slider to see it matter.`:T<1?`T = ${T.toFixed(2)} multiplies every logit by ${(1/T).toFixed(2)}, which stretches the gaps between them, so the top token pulls further ahead (sharper).`:`T = ${T.toFixed(2)} shrinks every logit to ${(1/T).toFixed(2)}×, which narrows the gaps between them, so the odds even out (flatter).`;
TOYS.dice={title:'Loaded Dice',short:'Loaded Dice',level:7,color:'var(--sky)',tb1:'var(--sky)',tb2:'var(--grape)',icon:ICONS.dice,
  help:'Roll the die, then reshape it with temperature and top-p.',
  html:`      <div class="canvas" style="display:grid;gap:12px">
        <div class="row">
          <span class="label">Prompt:</span>
          <div class="seg" id="promptSeg">
            <button type="button" data-p="0" aria-pressed="true">Motion</button>
            <button type="button" data-p="1" aria-pressed="false">Evidence</button>
            <button type="button" data-p="2" aria-pressed="false">Case cite ⚠</button>
          </div>
        </div>
        <div class="prompt-line" id="promptLine"></div>
        <div class="probs" id="probs"></div>
        <label class="slider-row"><span>Temperature</span><input type="range" id="temp" min="0.05" max="2" step="0.05" value="1"><output id="tempOut">1.00</output></label>
        <label class="slider-row"><span>Top-p</span><input type="range" id="topp" min="0.1" max="1" step="0.05" value="1"><output id="toppOut">1.00</output></label>
        <div class="row">
          <button class="btn pink" type="button" id="roll1">Roll once 🎲</button>
          <button class="btn sky" type="button" id="roll20">Roll 20 times</button>
          <button class="btn lemon small" type="button" id="rollClear">Clear</button>
        </div>
        <div class="tally" id="tally"></div>
        <div class="result" id="result" hidden></div>
      </div>
      <div class="nerd">
        <div class="nerd-h"><svg viewBox="0 0 30 16" aria-hidden="true"><circle cx="7" cy="8" r="5.5" fill="#fff" stroke="#1a1033" stroke-width="2"/><circle cx="23" cy="8" r="5.5" fill="#fff" stroke="#1a1033" stroke-width="2"/><path d="M12.5 7h5" stroke="#1a1033" stroke-width="2"/></svg>NERD MODE · the math</div>
        <div class="nerd-b">
          <div class="eqs">
            <div class="eq"><span class="cap">Logits: the last token's final vector times the "unembedding" matrix:</span><b>z</b> = <b>h</b><sub><i>n</i></sub><sup>(<i>L</i>)</sup> <i>W</i><sub><i>U</i></sub> &nbsp; ∈ ℝ<sup>|<i>V</i>|</sup></div>
            <div class="eq"><span class="cap">Softmax with temperature:</span><i>p</i><sub><i>i</i></sub> = <span class="frac"><span>exp(<i>z</i><sub><i>i</i></sub> / <i>T</i>)</span><span><span class="big">Σ</span><sub><i>j</i></sub> exp(<i>z</i><sub><i>j</i></sub> / <i>T</i>)</span></span></div>
            <div class="live" id="liveSamp"></div>
            <div class="eq"><span class="cap">Top-p (nucleus): keep the smallest set <i>S</i> of most-likely tokens whose mass reaches <i>p</i>, then renormalize:</span>Σ<sub><i>i</i> ∈ <i>S</i></sub> <i>p</i><sub><i>i</i></sub> ≥ <i>p</i>, &nbsp;&nbsp; <i>p</i>′<sub><i>i</i></sub> = <span class="frac"><span><i>p</i><sub><i>i</i></sub></span><span>Σ<sub><i>j</i> ∈ <i>S</i></sub> <i>p</i><sub><i>j</i></sub></span></span></div>
            <div class="eq"><span class="cap">A whole answer is a chain of these choices:</span><i>P</i>(<i>y</i><sub>1</sub>…<i>y</i><sub><i>m</i></sub> | <b>x</b>) = <span class="big">Π</span><sub><i>t</i>=1</sub><sup><i>m</i></sup> <i>p</i>(<i>y</i><sub><i>t</i></sub> | <b>x</b>, <i>y</i><sub>&lt;<i>t</i></sub>)</div>
            <div class="eq"><span class="cap">Pretraining loss (cross-entropy on the true next token) and perplexity:</span>ℒ(<i>θ</i>) = −<span class="frac"><span>1</span><span><i>N</i></span></span> <span class="big">Σ</span><sub><i>t</i></sub> log <i>p</i><sub><i>θ</i></sub>(<i>x</i><sub><i>t</i>+1</sub> | <i>x</i><sub>≤<i>t</i></sub>), &nbsp;&nbsp; PPL = <i>e</i><sup>ℒ</sup></div>
          </div>
          <div class="where">
            <span class="label">Where</span>
            <div><b>h<sub>n</sub><sup>(L)</sup></b><span>the vector of the last token after all <i>L</i> layers</span></div>
            <div><b>W<sub>U</sub></b><span>unembedding matrix, <i>d</i> × |<i>V</i>|; often tied to <i>W<sub>E</sub></i></span></div>
            <div><b>T</b><span>temperature; <i>T</i> → 0 is greedy argmax</span></div>
            <div><b>θ</b><span>all the model's parameters</span></div>
            <div><b>PPL</b><span>perplexity: "how many tokens the model is torn between," on average</span></div>
            <div><b>Note</b><span>nothing in these formulas checks truth. They score how typical the text is.</span></div>
          </div>
        </div>
      </div>`,
  init(){
const PROMPTS=[
  {text:'The defendant filed a motion to',c:[['dismiss',3.4,' dismiss for failure to state a claim.'],['compel',2.2,' compel discovery responses.'],['suppress',1.9,' suppress the evidence seized.'],['strike',1.3,' strike the affirmative defenses.'],['continue',1.0,' continue the trial date.'],['quash',.7,' quash the subpoena.'],['banana',-3,' banana. (Nonsense, but never quite 0% likely.)']]},
  {text:'Under the parol evidence rule, prior oral agreements are generally',c:[['inadmissible',3.0,' inadmissible to contradict a fully integrated writing.'],['excluded',2.6,' excluded when the writing is fully integrated.'],['barred',1.7,' barred from varying the written terms.'],['admissible',.6,' admissible. (Low probability, and wrong as a general statement.)'],['irrelevant',.2,' irrelevant to interpretation.'],['delicious',-3.5,' delicious. (Absurd tail token.)']]},
  {text:'The leading case on this exact issue is',fake:true,c:[['Smith',1.7,' Smith v. Jones, 412 S.W.3d 118 (Mo. 2013).'],['In',1.6,' In re Estate of Hartwell, 287 S.W.3d 640 (Mo. App. 2009).'],['Johnson',1.3,' Johnson v. Johnson Family Trust, 361 S.W.3d 22 (Mo. banc 2012).'],['State',1.0,' State ex rel. Miller v. Dowd, 198 S.W.3d 77 (Mo. 2006).'],['the',.9,' the 2011 decision in Estate of Price v. Price.'],['unclear',-.2,' unclear; I would need to search a legal database to answer.']]}
];
let pIdx=0,tallyArr=[];
function probsFor(){
  const T=+$('#temp').value,P=+$('#topp').value;const cs=PROMPTS[pIdx].c;
  const mx=Math.max(...cs.map(c=>c[1]/T));const ex=cs.map(c=>Math.exp(c[1]/T-mx));const s=ex.reduce((a,b)=>a+b,0);
  const pr=ex.map(e=>e/s);const order=pr.map((p,i)=>[p,i]).sort((a,b)=>b[0]-a[0]);
  let cum=0;const keep=new Set();for(const [p,i] of order){keep.add(i);cum+=p;if(cum>=P)break}
  const ks=[...keep].reduce((a,i)=>a+pr[i],0);
  return cs.map((c,i)=>({w:c[0],p:pr[i],kept:keep.has(i),pk:keep.has(i)?pr[i]/ks:0}));
}
function drawProbs(hit=-1){
  $('#tempOut').textContent=(+$('#temp').value).toFixed(2);$('#toppOut').textContent=(+$('#topp').value).toFixed(2);
  $('#promptLine').innerHTML=esc(PROMPTS[pIdx].text)+' <span class="next">???</span>';
  const ps=probsFor();const box=$('#probs');box.innerHTML='';
  ps.forEach((p,i)=>{const r=document.createElement('div');r.className='prob'+(p.kept?'':' cut')+(i===hit?' hit':'');
    r.innerHTML=`<span class="w">${esc(p.w)}</span><div class="track"><i style="width:${(p.kept?p.pk:p.p)*100}%"></i></div><span class="pct">${((p.kept?p.pk:0)*100).toFixed(1)}%</span>`;
    r.dataset.hint=p.kept?`"${p.w}": ${(p.pk*100).toFixed(1)}% chance of being picked`:`"${p.w}" was cut by top-p; it can't be picked now.`;box.appendChild(r)});
  const T=+$('#temp').value, cs=PROMPTS[pIdx].c, ex=cs.map(c=>Math.exp(c[1]/T)), S=ex.reduce((a,b)=>a+b,0);
  $('#liveSamp').innerHTML=`Live: logit z(“${esc(cs[0][0])}”) = <b>${cs[0][1].toFixed(2)}</b>, T = <b>${T.toFixed(2)}</b> → p = e<sup>${(cs[0][1]/T).toFixed(2)}</sup> ÷ (${cs.map(c=>'e<sup>'+(c[1]/T).toFixed(2)+'</sup>').join(' + ')}) = ${ex[0].toFixed(2)} ÷ ${S.toFixed(2)} = <b>${(ex[0]/S).toFixed(3)}</b><br><span style="font-size:16px">${tNote(T)}</span>`;
}
function sample(){const ps=probsFor();let r=Math.random(),acc=0;for(let i=0;i<ps.length;i++){acc+=ps[i].pk;if(r<=acc&&ps[i].kept)return i}return ps.findIndex(p=>p.kept)}
function showResult(i){const pr=PROMPTS[pIdx];const c=pr.c[i];const res=$('#result');res.hidden=false;
  let html=`<div><span class="label">Generated</span></div><div style="font-family:var(--mono);font-size:22px;line-height:1.2">${esc(pr.text)}<b style="background:var(--lemon-l)">${esc(c[2])}</b></div>`;
  if(pr.fake){html+=c[0]==='unclear'?`<div><span class="stamp good">HONEST</span> The rare token that admits uncertainty. Preference tuning tries to make this more likely.</div>`:`<div><span class="stamp bad">MADE UP</span> This citation was invented for this demo and stands in for what a model can produce: the right reporter format, a plausible court and year, and no guarantee the case exists. Do not cite it.</div>`}
  res.innerHTML=html}
$('#roll1').onclick=()=>{const i=sample();tallyArr.push(PROMPTS[pIdx].c[i][0]);drawProbs(i);drawTally();showResult(i);blip(780)};
$('#roll20').onclick=()=>{let last;for(let k=0;k<20;k++){last=sample();tallyArr.push(PROMPTS[pIdx].c[last][0])}drawProbs(last);drawTally();showResult(last);blip(900,.12)};
$('#rollClear').onclick=()=>{tallyArr=[];drawTally();$('#result').hidden=true;drawProbs()};
function drawTally(){const t=$('#tally');t.innerHTML='';if(!tallyArr.length)return;const counts={};tallyArr.forEach(w=>counts[w]=(counts[w]||0)+1);
  t.insertAdjacentHTML('beforeend',`<span style="background:var(--lemon)">${tallyArr.length} rolls</span>`);
  Object.entries(counts).sort((a,b)=>b[1]-a[1]).forEach(([w,n])=>t.insertAdjacentHTML('beforeend',`<span>${esc(w)} × ${n}</span>`))}
$$('#promptSeg button').forEach(b=>b.onclick=()=>{pIdx=+b.dataset.p;$$('#promptSeg button').forEach(x=>x.setAttribute('aria-pressed',x===b));tallyArr=[];drawTally();$('#result').hidden=true;drawProbs();blip(600)});
$('#temp').addEventListener('input',()=>drawProbs());$('#topp').addEventListener('input',()=>drawProbs());
drawProbs();
$('#roll20').addEventListener('click',()=>award('dice'));
$('#temp').addEventListener('input',()=>{if(+$('#temp').value<=0.3)award('cool')});
  }};
