/* ==== TOYS: the four Limits toys, ported from v1. One shared init wires all four. ==== */
TOYS.frequency={title:'Frequency Map',short:'Frequency Map',level:13,color:'var(--tang)',tb1:'var(--tang)',tb2:'var(--pink)',icon:ICONS.limits,
  help:'Shares in the training text versus shares in a low-temperature draft. Illustrative numbers.',
  html:`      <div class="canvas" style="display:grid;gap:12px">
        <div class="row" style="justify-content:space-between">
          <h3 class="lab-title">Argument frequency map</h3>
          <label class="toggle"><input type="checkbox" id="limNovel" checked> Novel issue: no binding in-state authority exists</label>
        </div>
        <p style="font-size:16px">Each row is a kind of argument a brief can make. The left bar is how much of the legal writing the model trained on uses that kind of argument. The right bar is how often the draft reaches for it, at a low drafting temperature (<i>T</i> = 0.7). Watch what happens to the rare rows on the way from left to right, and what happens when you turn the novel-issue switch on and off.</p>
        <div class="lim-rows" id="limFreq"></div>
        <p class="live" id="limFreqNote"></p>
      </div>
      <div class="nerd">
        <div class="nerd-h"><svg viewBox="0 0 30 16" aria-hidden="true"><circle cx="7" cy="8" r="5.5" fill="#fff" stroke="#1a1033" stroke-width="2"/><circle cx="23" cy="8" r="5.5" fill="#fff" stroke="#1a1033" stroke-width="2"/><path d="M12.5 7h5" stroke="#1a1033" stroke-width="2"/></svg>NERD MODE · why the edges get squeezed</div>
        <div class="nerd-b">
          <div class="eqs">
            <div class="eq"><span class="cap">A perfectly trained model reproduces the frequencies in its training data, given the same context:</span><i>p</i><sub><i>T</i>=1</sub>(<i>a</i> | <i>c</i>) = <i>f</i>(<i>a</i> | <i>c</i>)</div>
            <div class="eq"><span class="cap">So its logits act like log-frequencies, and temperature becomes a power:</span><i>z</i><sub><i>a</i></sub> = log <i>f</i>(<i>a</i> | <i>c</i>) + const &nbsp;⟹&nbsp; <i>p</i><sub><i>T</i></sub>(<i>a</i>) = <span class="frac"><span><i>f</i>(<i>a</i>)<sup>1/<i>T</i></sup></span><span><span class="big">Σ</span><sub><i>b</i></sub> <i>f</i>(<i>b</i>)<sup>1/<i>T</i></sup></span></span></div>
            <div class="eq"><span class="cap">With <i>T</i> &lt; 1 the power is above 1, so small shares shrink faster than big ones. Expected appearances in <i>N</i> drafts:</span>E[count(<i>a</i>)] = <i>N</i> · <i>p</i><sub><i>T</i></sub>(<i>a</i>)</div>
            <div class="live" id="limLive"></div>
            <div class="eq"><span class="cap">Temperature rescales every log-odds ratio by the same factor. It can't single out the good rare option:</span>log <span class="frac"><span><i>p</i><sub><i>T</i></sub>(<i>a</i>)</span><span><i>p</i><sub><i>T</i></sub>(<i>b</i>)</span></span> = <span class="frac"><span><i>z</i><sub><i>a</i></sub> − <i>z</i><sub><i>b</i></sub></span><span><i>T</i></span></span></div>
            <div class="eq"><span class="cap">A source can only be cited if it was retrieved onto the desk or recalled from the weights, and recall is where invented citations come from:</span><i>P</i>(cite <i>x</i>) ≤ <i>P</i>(<i>x</i> ∈ <i>D</i><sub><i>q</i></sub>) + <i>P</i>(<i>x</i> recalled)</div>
            <div class="eq"><span class="cap">Why prompting works: asking changes the context <i>c</i>, and the frequencies conditional on the new context are different:</span><i>f</i>(out-of-state | <i>c</i> ⊕ "cite other states") ≫ <i>f</i>(out-of-state | <i>c</i>)</div>
          </div>
          <div class="where">
            <span class="label">Where</span>
            <div><b>a, b</b><span>kinds of argument (or any candidate continuations)</span></div>
            <div><b>c</b><span>the context: everything on the desk</span></div>
            <div><b>f(a | c)</b><span>how often <i>a</i> followed contexts like <i>c</i> in the training text</span></div>
            <div><b>T</b><span>temperature; drafting tools often run well below 1</span></div>
            <div><b>D<sub>q</sub></b><span>the passages retrieved for query <i>q</i></span></div>
            <div><b>Caveat</b><span>real models don't match training frequencies perfectly, and preference tuning reshapes them further. The direction of the effect is the point.</span></div>
          </div>
        </div>
      </div>`,
  init(){
const ARGS=[
  {k:'bind',n:'Binding in-state precedent',f:46,c:'#2f8cff'},
  {k:'stat',n:'Statute or rule text',f:18,c:'#8b4dff'},
  {k:'anal',n:'In-state analogies',f:14,c:'#36d65a'},
  {k:'hedge',n:'Hedging ("the law is unsettled")',f:8,c:'#b9b3c6'},
  {k:'uni',n:'Uniform laws & secondary sources',f:4,c:'#ffd92e'},
  {k:'oos',n:'Out-of-state persuasive authority',f:4,c:'#ff8a1f'},
  {k:'pol',n:'Public policy argument',f:2.5,c:'#ff2d95'},
  {k:'nov',n:'Genuinely new theory',f:0.5,c:'#d4004f'}];
const share=(fs,T)=>{const w=fs.map(f=>Math.pow(f,1/T));const s=w.reduce((a,b)=>a+b,0);return w.map(x=>x/s)};
const pct=x=>(x*100).toFixed(x<.01?2:1)+'%';
/* toy 1 */
function freq(){const novel=$('#limNovel').checked;const T=0.7;
  const avail=ARGS.filter(a=>!(novel&&a.k==='bind'));const tr=share(avail.map(a=>a.f),1),dr=share(avail.map(a=>a.f),T);
  let h='<div class="lim-row head"><span>KIND OF ARGUMENT</span><span>SHARE OF TRAINING TEXT</span><span>SHARE OF THE DRAFT (T = 0.7)</span></div>';
  ARGS.forEach(a=>{const i=avail.indexOf(a);
    if(i<0){h+=`<div class="lim-row gone"><span class="nm">${a.n}</span><span class="tip">doesn't exist for this issue</span><span></span></div>`;return}
    h+=`<div class="lim-row"><span class="nm"><i style="background:${a.c}"></i>${a.n}</span><span class="bw"><span class="track"><i style="width:${tr[i]*100}%;background:${a.c}"></i></span><span class="pc">${pct(tr[i])}</span></span><span class="bw"><span class="track"><i style="width:${dr[i]*100}%;background:${a.c}"></i></span><span class="pc">${pct(dr[i])}</span></span></div>`});
  $('#limFreq').innerHTML=h;
  const io=avail.findIndex(a=>a.k==='oos'),ip=avail.findIndex(a=>a.k==='pol');
  $('#limFreqNote').innerHTML=novel?`With no binding precedent available, its share doesn't flow to the advocate's moves. It spreads across everything in proportion, so most of it lands on statute text, weaker in-state analogies and hedging. Out-of-state authority ends up at <b>${pct(dr[io])}</b> of the draft and public policy at <b>${pct(dr[ip])}</b>, down from ${pct(tr[io])} and ${pct(tr[ip])} of the training text. Low temperature squeezes rare things harder than common ones.`:`On an ordinary issue, binding precedent dominates both columns and the rare moves are nearly invisible. That's usually fine, because on an ordinary issue the binding case is the right argument. Now switch the novel-issue toggle back on.`;
  limLive();
}
/* toy 2 */
const JUNK_N=2000,JUNK_F=2e-6;
const SERIES=[{k:'oos',n:'Out-of-state authority',c:'#ff8a1f'},{k:'pol',n:'Public policy',c:'#ff2d95'},{k:'nov',n:'New theory',c:'#d4004f'},{k:'junk',n:'Junk (off-topic, garbled, wrong genre)',c:'#5b5470',dash:true}];
function tShares(T){const avail=ARGS.filter(a=>a.k!=='bind');const w=avail.map(a=>Math.pow(a.f/100,1/T));const jw=JUNK_N*Math.pow(JUNK_F,1/T);const s=w.reduce((a,b)=>a+b,0)+jw;const out={junk:jw/s};avail.forEach((a,i)=>out[a.k]=w[i]/s);return out}
function tchart(){const T=+$('#limT').value;$('#limTOut').textContent=T.toFixed(2);
  const svg=$('#limChart');svg.innerHTML='';const X0=56,X1=660,Y0=262,Y1=16,ymax=.6;
  const X=t=>X0+(t-.2)/1.8*(X1-X0),Y=v=>Y0-Math.min(v,ymax)/ymax*(Y0-Y1);
  for(let v=0;v<=ymax+1e-9;v+=.1){el('line',{x1:X0,x2:X1,y1:Y(v),y2:Y(v),stroke:'#e2ddd0','stroke-width':1},svg);const t=el('text',{x:X0-8,y:Y(v)+5,'text-anchor':'end','font-family':'VT323, monospace','font-size':17,fill:'#574f6e'},svg);t.textContent=Math.round(v*100)+'%'}
  [.2,.5,1,1.5,2].forEach(t=>{const tx=el('text',{x:X(t),y:Y0+20,'text-anchor':'middle','font-family':'VT323, monospace','font-size':17,fill:'#574f6e'},svg);tx.textContent='T='+t});
  el('line',{x1:X0,x2:X1,y1:Y0,y2:Y0,stroke:'#1a1033','stroke-width':2},svg);
  SERIES.forEach(s=>{let d='';for(let t=.2;t<=2.0001;t+=.025){const v=tShares(t)[s.k];d+=(d?'L':'M')+X(t).toFixed(1)+' '+Y(v).toFixed(1)}
    el('path',{d,fill:'none',stroke:s.c,'stroke-width':3.5,'stroke-dasharray':s.dash?'8 6':'none','stroke-linejoin':'round'},svg)});
  el('line',{x1:X(T),x2:X(T),y1:Y1,y2:Y0,stroke:'#1a1033','stroke-width':2,'stroke-dasharray':'3 4'},svg);
  const cur=tShares(T);SERIES.forEach(s=>el('circle',{cx:X(T),cy:Y(cur[s.k]),r:6,fill:s.c,stroke:'#1a1033','stroke-width':2},svg));
  const t1=tShares(.7),t2=tShares(T);
  $('#limTNote').innerHTML=`At T = ${T.toFixed(2)}: out-of-state ${pct(cur.oos)} · public policy ${pct(cur.pol)} · new theory ${pct(cur.nov)} · <b>junk ${pct(cur.junk)}</b>. `+(T>1.05?`Compared with T = 0.70, the three good rare moves gained ${((cur.oos+cur.pol+cur.nov-t1.oos-t1.pol-t1.nov)*100).toFixed(1)} points between them, while junk gained ${((cur.junk-t1.junk)*100).toFixed(1)} points. More variety, mostly the wrong kind.`:T<.95?'Everything rare is suppressed, junk included. The draft is clean, consistent and conventional.':'At T = 1 the draft mirrors the training frequencies exactly.');
}
/* toy 3 */
const HL=[['instate','In-state authority','#d4e7ff','#2f8cff'],['statute','Statute text','#e6dbff','#8b4dff'],['hedge','Hedging','#ece8f3','#8a8494'],['oos','Out-of-state authority','#ffe2c6','#ff8a1f'],['uni','Uniform law & secondary','#fff4b8','#c9a500'],['policy','Public policy','#ffd3e8','#ff2d95'],['frame','First-impression framing','#ffd6d6','#d4004f']];
const hlOn=new Set(HL.map(h=>h[0]));
function hl(){const box=$('#hlBtns');box.innerHTML='';HL.forEach(([k,n,bg,bd])=>{const b=document.createElement('button');b.type='button';b.className='hl-btn';b.setAttribute('aria-pressed',hlOn.has(k));b.innerHTML=`<i style="background:${bg};border-color:${bd}"></i>${n}`;
  b.onclick=()=>{hlOn.has(k)?hlOn.delete(k):hlOn.add(k);paintHL();hl()};box.appendChild(b)});
  const all=document.createElement('button');all.type='button';all.className='btn small lemon';all.textContent=hlOn.size===HL.length?'Clear':'Show all';all.onclick=()=>{if(hlOn.size===HL.length)hlOn.clear();else HL.forEach(h=>hlOn.add(h[0]));paintHL();hl()};box.appendChild(all)}
function paintHL(){const d=$('#drafts');HL.forEach(([k])=>d.classList.toggle('on-'+k,hlOn.has(k)))}
$('#missList').innerHTML='<span class="label">Missing from this draft</span>'+[['oos','Out-of-state persuasive authority'],['uni','Uniform law and secondary sources'],['policy','A public policy argument'],['frame','Framing it as a first-impression question to win']].map(([k,n])=>`<div class="missing ${k}">✗ ${n}</div>`).join('');
/* toy 4 */
const MIT=[
  {k:'ask',n:'Ask for the uncommon moves by name',d:'"Include persuasive authority from other states and a public policy argument." The request becomes part of the context, and in contexts like that, those moves are common.',b:{oos:.9,pol:1.5,hedge:-.6}},
  {k:'wide',n:'Widen retrieval to all jurisdictions + secondary sources',d:'Out-of-state cases and treatises now land on the desk, so the model can cite them instead of omitting or inventing them.',b:{oos:.6,uni:.9}},
  {k:'brain',n:'Brainstorm before drafting',d:'First ask for a list of every kind of argument available, including unusual ones, then draft from the list. Listing pulls the rare options into the context.',b:{pol:.3,nov:.9,uni:.3}},
  {k:'crit',n:'Self-critique pass',d:'"What would an inventive advocate add to this draft?" A second pass reads the first draft as context and is good at spotting gaps.',b:{pol:.3,oos:.1,hedge:-.6,nov:.3}},
  {k:'att',n:'Attorney review',d:'A person who understands why existing law doesn\'t fit supplies the genuinely new theory, which the model can then help develop.',b:{nov:2.3,hedge:-.5}}];
const mitOn=new Set();
function mitOpts(){const box=$('#mitOpts');box.innerHTML='';MIT.forEach(m=>{const l=document.createElement('label');l.className='mit-opt';l.innerHTML=`<input type="checkbox" id="mit-${m.k}" ${mitOn.has(m.k)?'checked':''}><span><b>${m.n}</b><span class="tip" style="display:block">${m.d}</span></span>`;
  l.querySelector('input').onchange=e=>{e.target.checked?mitOn.add(m.k):mitOn.delete(m.k);mit();if(mitOn.has('att'))award('novel');blip(500+mitOn.size*80)};box.appendChild(l)})}
function mit(){const T=.7;const avail=ARGS.filter(a=>a.k!=='bind');
  const z=avail.map(a=>{let v=Math.log(a.f/100);MIT.forEach(m=>{if(mitOn.has(m.k)&&m.b[a.k])v+=m.b[a.k]});return v});
  const mx=Math.max(...z.map(v=>v/T));const w=z.map(v=>Math.exp(v/T-mx));const s=w.reduce((a,b)=>a+b,0);const p=w.map(x=>x/s);
  $('#mitStack').innerHTML=avail.map((a,i)=>`<span style="width:${(p[i]*100).toFixed(2)}%;background:${a.c}" title="${a.n}: ${pct(p[i])}"></span>`).join('');
  $('#mitLegend').innerHTML=avail.map((a,i)=>`<span><i style="background:${a.c}"></i>${a.n.split(' (')[0]} ${pct(p[i])}</span>`).join('');
  const get=k=>p[avail.findIndex(a=>a.k===k)];
  const items=[['oos','Out-of-state persuasive authority',.08],['uni','Uniform law & secondary sources',.08],['pol','Public policy argument',.08],['nov','A genuinely new theory',.06]];
  $('#mitCheck').innerHTML=items.map(([k,n,th])=>{const v=get(k),ok=v>=th;return`<div class="${ok?'ok':'no'}"><span class="mark">${ok?'✓':'✗'}</span>${n} <span class="ms">${pct(v)}</span></div>`}).join('');
  const nov=get('nov');
  $('#mitNote').innerHTML=!mitOn.size?'Baseline: a novel issue at low temperature with in-state retrieval. The draft is mostly statute text, in-state analogies and hedging.':
    (nov<.06?`Better. Notice that none of the automated fixes produce a genuinely new theory (still ${pct(nov)}). They make the model better at finding and using arguments that already exist somewhere in the record of legal writing. Turn on attorney review to see the last piece.`:`With an attorney supplying the new theory, the model can develop it. The person brings the idea that doesn't exist yet; the model helps find support and write it up.`);
}
function limLive(){const novel=$('#limNovel').checked;const avail=ARGS.filter(a=>!(novel&&a.k==='bind'));const dr=share(avail.map(a=>a.f),.7);const ip=avail.findIndex(a=>a.k==='pol'),io=avail.findIndex(a=>a.k==='oos');
    $('#limLive').innerHTML=`Right now: public policy has f = ${(share(avail.map(a=>a.f),1)[ip]).toFixed(3)} of training text. At T = 0.7, p = f<sup>1/0.7</sup> ÷ Σ f<sup>1/0.7</sup> = <b>${dr[ip].toFixed(4)}</b>, so it shows up in about <b>${(dr[ip]*100).toFixed(1)}</b> of every 100 draft arguments. Out-of-state authority: about <b>${(dr[io]*100).toFixed(1)}</b>.`}
$('#limNovel').onchange=()=>{freq();blip(600);award('edge')};
$('#limT').addEventListener('input',tchart);
$('#limLegend').innerHTML=SERIES.map(s=>`<span><i style="background:${s.c};${s.dash?'border-style:dashed':''}"></i>${s.n}</span>`).join('');
freq();tchart();hl();paintHL();mitOpts();mit();
  }};
TOYS.temperature={title:'Temperature Chart',short:'Temp Chart',level:13,color:'var(--tang)',tb1:'var(--tang)',tb2:'var(--lemon)',icon:ICONS.scaling,
  help:'Why turning up the temperature does not rescue the rare good arguments.',
  html:`      <div class="canvas" style="display:grid;gap:12px">
        <h3 class="lab-title">Temperature won't fix it</h3>
        <p style="font-size:16px">If the draft is too conventional, why not turn up the temperature? Because temperature has no idea which unlikely options are good. It shrinks every gap between likely and unlikely at once. The model's vocabulary also holds thousands of irrelevant continuations (off-topic text, garbled citations, wrong-genre phrasing), each individually tiny. As <i>T</i> rises, the good rare arguments grow a little and that crowd of junk grows a lot.</p>
        <label class="slider-row"><span>Temperature</span><input type="range" id="limT" min="0.2" max="2" step="0.05" value="0.7"><output id="limTOut">0.70</output></label>
        <div class="scroll-x"><svg id="limChart" viewBox="0 0 680 300" style="width:100%;min-width:560px;height:auto;display:block" role="img" aria-label="Share of argument types versus temperature"></svg></div>
        <div class="legend" id="limLegend"></div>
        <p class="live" id="limTNote"></p>
      </div>`};
TOYS.drafts={title:'Two Drafts',short:'Two Drafts',level:13,color:'var(--tang)',tb1:'var(--tang)',tb2:'var(--grape)',icon:ICONS.abc,
  help:'A fictional hypothetical in the fictional State of Westmore. Click colors to highlight argument types.',
  html:`      <div class="canvas" style="display:grid;gap:12px">
        <h3 class="lab-title">AI first draft vs. an advocate's draft</h3>
        <p style="font-size:16px"><b>Hypothetical issue (fictional State of Westmore):</b> Does a beneficiary trigger a trust's no-contest clause by filing a petition that asks the court only to construe an ambiguous term? No Westmore appellate court has decided the question. Click the colors to highlight each kind of argument.</p>
        <div class="row" id="hlBtns"></div>
        <div class="drafts on-all" id="drafts">
          <div class="draft">
            <h4>AI first draft</h4>
            <p><mark class="instate">Westmore courts strictly construe no-contest clauses and enforce them to carry out the settlor's intent. <i>See Doe v. Doe Family Trust</i> (Westmore Ct. App.) (fictional).</mark> <mark class="statute">The Westmore Trust Code does not define "contest."</mark> <mark class="hedge">Because no Westmore appellate court has addressed whether a petition for construction is a contest, the outcome is uncertain, and a court could find the clause triggered.</mark> <mark class="hedge">Counsel should weigh the risk of forfeiture before filing.</mark></p>
            <div class="miss" id="missList"></div>
          </div>
          <div class="draft">
            <h4>Advocate's draft</h4>
            <p><mark class="instate">Westmore strictly construes no-contest clauses to carry out the settlor's intent.</mark> <mark class="statute">The Trust Code does not define "contest,"</mark> <mark class="frame">and no Westmore court has decided whether a construction petition is one. This is a question of first impression, and the Court should answer it no.</mark> <mark class="oos">Courts in other states that have faced the question have held that a petition seeking only construction of an ambiguous term is not a contest, because it seeks to carry out the settlor's intent rather than defeat it. <i>See In re Calder Trust</i> (fictional); <i>Matter of Ostrow</i> (fictional).</mark> <mark class="uni">The Uniform Probate Code and the Restatement point the same direction, refusing to enforce penalty clauses against beneficiaries who act with probable cause.</mark> <mark class="policy">Sound policy supports the rule. A beneficiary who asks a court what an ambiguous provision means is helping to effectuate the settlor's intent. Penalizing that request forces beneficiaries to guess, inviting the very litigation the clause was meant to prevent.</mark></p>
          </div>
        </div>
      </div>`};
TOYS.mitigation={title:'Mitigation Lab',short:'Mitigation Lab',level:13,color:'var(--tang)',tb1:'var(--lime)',tb2:'var(--sky)',icon:ICONS.tuner,
  help:'Each fix changes what is on the desk or what is asked. Illustrative boosts, not measurements.',
  html:`      <div class="canvas" style="display:grid;gap:12px">
        <h3 class="lab-title">Mitigation lab</h3>
        <p style="font-size:16px">Each fix changes either what's on the desk or what's being asked, which changes the probabilities the model works from. Turn them on one at a time and watch the draft's mix of arguments shift.</p>
        <div class="mit-grid">
          <div class="mit-opts" id="mitOpts"></div>
          <div style="display:grid;gap:12px;align-content:start;min-width:0">
            <span class="label">The draft's mix of arguments</span>
            <div class="stack" id="mitStack"></div>
            <div class="legend" id="mitLegend"></div>
            <span class="label">Advocate's moves present in the draft</span>
            <div class="check" id="mitCheck"></div>
            <p class="live" id="mitNote"></p>
          </div>
        </div>
      </div>`};
