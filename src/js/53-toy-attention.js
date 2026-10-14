/* ==== TOYS: Attention Lab and the three heads (ported from v1) ==== */
TOYS.attention={title:'Attention Lab',short:'Attention Lab',level:4,color:'var(--tang)',tb1:'var(--tang)',tb2:'var(--lemon)',icon:ICONS.attention,
  help:'Toy vectors with 4 numbers instead of thousands, hand-picked so you can read them.',
  html:`      <div class="canvas lab" style="display:grid;gap:14px">
        <div class="row" style="justify-content:space-between;align-items:baseline">
          <h3 class="lab-title">Attention lab: how one word decides where to look</h3>
          <span class="tip">Toy vectors with 4 numbers instead of thousands, hand-picked so you can read them.</span>
        </div>
        <div class="lab-top">
          <div class="sticky-note" style="transform:none">
            <h3>The party, in one paragraph</h3><p>"It" holds up its sign (the <b>query</b>): looking for a noun, ideally something that can be void. It reads each earlier word's name tag (the <b>key</b>) and scores the match with a shopping-list dot product. The scores become percentages. Then "it" copies from each word's backpack (the <b>value</b>) in proportion: mostly from <i>clause</i>, some from <i>court</i>. The rows below show every number. Drag the sliders to rewrite the sign and watch the percentages move.</p>
          </div>
          <div class="canvas" style="display:grid;gap:6px;background:#fff">
            <span class="label">What a dot product measures</span>
            <svg viewBox="0 0 330 132" width="100%" role="img" aria-label="Three dot product cases: aligned, perpendicular, opposite">
              <defs><marker id="ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10z" fill="#1a1033"/></marker></defs>
              <g transform="translate(15,10)"><path d="M10 70 L80 30" stroke="#ff2d95" stroke-width="3.5" marker-end="url(#ah)"/><path d="M10 70 L84 44" stroke="#2f8cff" stroke-width="3.5" marker-end="url(#ah)"/><circle cx="10" cy="70" r="3" fill="#1a1033"/><text x="45" y="98" text-anchor="middle" font-family="Comic Neue, sans-serif" font-size="12" font-weight="700" fill="#1a1033">same way</text><text x="45" y="112" text-anchor="middle" font-family="VT323, monospace" font-size="15" fill="#1a1033">big + score</text></g>
              <g transform="translate(120,10)"><path d="M10 70 L80 70" stroke="#ff2d95" stroke-width="3.5" marker-end="url(#ah)"/><path d="M10 70 L10 8" stroke="#2f8cff" stroke-width="3.5" marker-end="url(#ah)"/><circle cx="10" cy="70" r="3" fill="#1a1033"/><text x="45" y="98" text-anchor="middle" font-family="Comic Neue, sans-serif" font-size="12" font-weight="700" fill="#1a1033">unrelated (90°)</text><text x="45" y="112" text-anchor="middle" font-family="VT323, monospace" font-size="15" fill="#1a1033">score ≈ 0</text></g>
              <g transform="translate(225,10)"><path d="M45 50 L95 50" stroke="#ff2d95" stroke-width="3.5" marker-end="url(#ah)"/><path d="M45 50 L-5 50" stroke="#2f8cff" stroke-width="3.5" marker-end="url(#ah)"/><circle cx="45" cy="50" r="3" fill="#1a1033"/><text x="45" y="98" text-anchor="middle" font-family="Comic Neue, sans-serif" font-size="12" font-weight="700" fill="#1a1033">opposite</text><text x="45" y="112" text-anchor="middle" font-family="VT323, monospace" font-size="15" fill="#1a1033">negative score</text></g>
            </svg>
            <div class="eq" style="font-size:18px;white-space:normal"><b>q</b> · <b>k</b> = <i>q</i><sub>1</sub><i>k</i><sub>1</sub> + <i>q</i><sub>2</sub><i>k</i><sub>2</sub> + … + <i>q</i><sub><i>d</i></sub><i>k</i><sub><i>d</i></sub> = ‖<b>q</b>‖ ‖<b>k</b>‖ cos <i>θ</i></div>
            <p class="tip">Pink = query (the shopping list), blue = key (the shelves). The total is large only when both are high on the <i>same</i> items. Arrows pointing the same way score high, crossways about zero, opposite ways negative.</p>
          </div>
        </div>
        <div class="row">
          <span class="label">Which word is asking?</span>
          <div class="seg" id="labSeg">
            <button type="button" data-p="it" aria-pressed="true">"it"</button>
            <button type="button" data-p="who" aria-pressed="false">"who"</button>
            <button type="button" data-p="void" aria-pressed="false">"void"</button>
            <button type="button" data-p="held" aria-pressed="false">"held"</button>
          </div>
        </div>
        <p id="labWhy" style="font-size:16px"></p>
        <div>
          <span class="label">Its query, the sign it holds up: drag to change what it's looking for</span>
          <div class="qsl" id="labQ"></div>
        </div>
        <div class="steps-legend">
          <div><b>① KEY</b> Each earlier word's label: how much of each feature it has.</div>
          <div><b>② SCORE = q · k</b> Multiply query and key feature by feature, then add.</div>
          <div><b>③ ÷ √d</b> Divide by √4 = 2. With thousands of features, raw scores get huge; this keeps them in a range softmax handles well.</div>
          <div><b>④ eˣ</b> Exponentiate: every score turns positive and the leaders pull far ahead.</div>
          <div><b>⑤ WEIGHT</b> Divide each eˣ by their total so the weights add to 100%. ④ + ⑤ together are softmax.</div>
          <div><b>⑥ BLEND</b> New vector = Σ weight × value. The word now carries its matches' content.</div>
        </div>
        <div class="scroll-x"><table class="att-tbl" id="labTbl"></table></div>
        <div class="lab-out" id="labOut"></div>
        <div class="ml-link"><b>Who picks these numbers in a real model?</b>Nobody writes "pronouns look for nouns." Each word's vector is multiplied by three learned matrices, <i>W<sub>Q</sub></i>, <i>W<sub>K</sub></i>, <i>W<sub>V</sub></i>, to produce its query, key and value. Gradient descent tunes those matrices because linking "it" to "clause" helps predict what comes next (that "it" is "unenforceable," not "adjourned"). Each head gets its own three matrices, so each learns its own kind of question. Layers stack, so later layers ask questions about words that have already absorbed their context. The features also aren't neatly labeled like "noun" and "person"; real ones are tangled, and interpreting them is an active research field.</div>
      </div>
      <div class="nerd">
        <div class="nerd-h"><svg viewBox="0 0 30 16" aria-hidden="true"><circle cx="7" cy="8" r="5.5" fill="#fff" stroke="#1a1033" stroke-width="2"/><circle cx="23" cy="8" r="5.5" fill="#fff" stroke="#1a1033" stroke-width="2"/><path d="M12.5 7h5" stroke="#1a1033" stroke-width="2"/></svg>NERD MODE · the math</div>
        <div class="nerd-b">
          <div class="eqs">
            <div class="eq"><span class="cap">Three learned projections of the token vectors <i>H</i>:</span><i>Q</i> = <i>H W</i><sub><i>Q</i></sub>, &nbsp; <i>K</i> = <i>H W</i><sub><i>K</i></sub>, &nbsp; <i>V</i> = <i>H W</i><sub><i>V</i></sub></div>
            <div class="eq"><span class="cap">Scaled dot-product attention with a causal mask:</span>Attention(<i>Q</i>, <i>K</i>, <i>V</i>) = softmax<span class="big">(</span> <span class="frac"><span><i>Q K</i><sup>⊤</sup></span><span>√<i>d</i><sub><i>k</i></sub></span></span> + <i>M</i> <span class="big">)</span> <i>V</i>, &nbsp;&nbsp; <i>M</i><sub><i>ij</i></sub> = <span class="big">{</span> 0 if <i>j</i> ≤ <i>i</i>; &nbsp;−∞ if <i>j</i> &gt; <i>i</i></div>
            <div class="eq"><span class="cap">One cell of the heatmap above:</span><i>a</i><sub><i>ij</i></sub> = <span class="frac"><span>exp(<b>q</b><sub><i>i</i></sub> · <b>k</b><sub><i>j</i></sub> / √<i>d</i><sub><i>k</i></sub>)</span><span><span class="big">Σ</span><sub><i>j</i>′ ≤ <i>i</i></sub> exp(<b>q</b><sub><i>i</i></sub> · <b>k</b><sub><i>j</i>′</sub> / √<i>d</i><sub><i>k</i></sub>)</span></span></div>
            <div class="eq"><span class="cap">Many heads, then a residual block (repeated <i>L</i> times):</span>MHA(<i>H</i>) = [head<sub>1</sub>; … ; head<sub><i>h</i></sub>] <i>W</i><sub><i>O</i></sub> &nbsp;·&nbsp; <i>H</i>′ = <i>H</i> + MHA(LN(<i>H</i>)) &nbsp;·&nbsp; <i>H</i>″ = <i>H</i>′ + <i>W</i><sub>2</sub> σ(<i>W</i><sub>1</sub> LN(<i>H</i>′))</div>
            <div class="live" id="liveAtt"></div>
          </div>
          <div class="where">
            <span class="label">Where</span>
            <div><b>q<sub>i</sub>, k<sub>j</sub></b><span>"what am I looking for" and "what do I offer" vectors for tokens <i>i</i> and <i>j</i></span></div>
            <div><b>d<sub>k</sub></b><span>size of each head's vectors (e.g. 128); dividing by √<i>d<sub>k</sub></i> keeps the softmax from saturating</span></div>
            <div><b>M</b><span>the causal mask: −∞ becomes 0 after softmax, which blanks the future</span></div>
            <div><b>LN</b><span>layer normalization</span></div>
            <div><b>σ</b><span>a nonlinearity (GELU / SwiGLU) in the feed-forward "MLP" step, where much factual knowledge is thought to live</span></div>
          </div>
        </div>
      </div>`,
  init(){
const AW=['The','court','held','that','the','clause','was','void','because','it','penalized','a','beneficiary','who','had','probable','cause','.'];
const HEADS={
  ref:{w:{1:{0:.5},5:{4:.6,3:.1},9:{5:.72,1:.12},13:{12:.78},16:{15:.6,12:.1},12:{11:.5,5:.15}},note:{9:'"it" could grammatically point back to "court" or to "clause". This head puts most of its attention on "clause", so the vector for "it" now carries the meaning of "the clause". That is how the model reads the sentence as "the clause penalized a beneficiary" rather than "the court did". (The worked example above walks through this exact choice.)',13:'"who" points back to "beneficiary": the person who had probable cause.',16:'"cause" leans on "probable": together they form one legal term.'}},
  gram:{w:{2:{1:.65},6:{5:.55},7:{5:.45,6:.25},10:{9:.5,5:.2},14:{13:.4,12:.3},3:{2:.6},12:{10:.45}},note:{2:'"held" finds its subject, "court": who did the holding.',7:'"void" attaches to "clause" via "was": what is void.',10:'"penalized" finds who did it ("it" → the clause).',12:'"beneficiary" links to "penalized": who got penalized.'}},
  legal:{w:{7:{5:.35,2:.3},10:{7:.3,5:.3},12:{5:.3,10:.3},16:{15:.45,12:.15,5:.12},15:{12:.3,10:.2},8:{7:.4}},note:{7:'"void" weighs "clause" and "held": a court ruling that a provision is unenforceable.',16:'"cause" pulls in "probable", "beneficiary" and "clause": the probable-cause exception to a no-contest clause.',12:'"beneficiary" connects to "clause" and "penalized": the person a no-contest clause targets.'}}
};
let head='ref', aSel=9;const seenHeads=new Set(['ref']);
function attRow(h,i){const r=new Array(AW.length).fill(0);if(i===0){r[0]=1;return r}
  r[0]+=.12;r[i]+=.12;r[i-1]+=.16;const sp=HEADS[h].w[i]||{};for(const j in sp)r[+j]+=sp[j]*2.2;
  for(let j=1;j<i;j++)r[j]+=.02;let s=r.reduce((a,b)=>a+b,0);return r.map(v=>v/s)}
function drawAtt(){
  const svg=$('#attSvg');svg.innerHTML='';
  const xs=[];let x=10;const widths=AW.map(w=>Math.max(30,w.length*9+16));
  widths.forEach(w=>{xs.push(x+w/2);x+=w+6});
  const scale=880/(x);const X=v=>v*scale+10;
  const row=attRow(head,aSel);
  row.forEach((v,j)=>{if(j===aSel||v<.03)return;const x1=X(xs[aSel]),x2=X(xs[j]);const h=Math.min(160,Math.abs(x1-x2)*.6+20);
    el('path',{d:`M${x1} 175 C${x1} ${175-h} ${x2} ${175-h} ${x2} 175`,fill:'none',stroke:C.pink,'stroke-width':Math.max(1.5,v*22),opacity:Math.min(1,.25+v*1.6),'stroke-linecap':'round'},svg);
    if(v>.08){const t=el('text',{x:(x1+x2)/2,y:175-h*.75-4,'text-anchor':'middle','font-family':'VT323, monospace','font-size':18,fill:C.ink},svg);t.textContent=Math.round(v*100)+'%'}});
  AW.forEach((w,i)=>{const g=el('g',{class:'att-word'+(i===aSel?' sel':''),tabindex:'0',role:'button','aria-label':w,'data-hint':'Click "'+w+'" to see what it attends to.'},svg);
    const bw=widths[i]*scale;el('rect',{x:X(xs[i])-bw/2,y:180,width:bw,height:32,rx:6},g);
    const t=el('text',{x:X(xs[i]),y:201,'text-anchor':'middle'},g);t.textContent=w;
    const pick=()=>{aSel=i;drawAtt();blip(400+i*20)};g.onclick=pick;g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick()}}});
  const note=HEADS[head].note[aSel];
  const top=row.map((v,j)=>[v,j]).filter(p=>p[1]!==aSel).sort((a,b)=>b[0]-a[0])[0];
  const top3=row.map((v,j)=>[v,j]).sort((a,b)=>b[0]-a[0]).slice(0,3);
  $('#liveAtt').innerHTML=`Row for “${esc(AW[aSel])}” (${aSel+1} visible tokens): `+top3.map(([v,j])=>`a(${esc(AW[aSel])}→${esc(AW[j])}) = <b>${v.toFixed(2)}</b>`).join(' · ')+` · Σ<sub>j</sub> a = ${row.reduce((s,v)=>s+v,0).toFixed(2)}`;
  $('#attNote').innerHTML=note?esc(note):`"${esc(AW[aSel])}" mostly attends to "${esc(AW[top?top[1]:0])}" in this head. Nothing dramatic here, so it spreads its attention around nearby words and the first token. Try <b>it</b>, <b>who</b>, <b>void</b> or <b>cause</b>.`;
  drawHeat();
}
function drawHeat(){
  const wrap=$('#heatWrap');wrap.innerHTML='';
  const labels=document.createElement('div');labels.className='heat-labels';
  const grid=document.createElement('div');grid.className='heat';grid.style.gridTemplateColumns=`repeat(${AW.length},20px)`;
  AW.forEach((w,i)=>{const l=document.createElement('div');l.textContent=w;if(i===aSel)l.style.color=C.pink;labels.appendChild(l);
    const r=attRow(head,i);r.forEach((v,j)=>{const c=document.createElement('div');
      if(j<=i){c.style.background=`rgba(255,45,149,${Math.min(1,v*2.2)})`}else{c.style.background='#ece8de'}
      if(i===aSel)c.style.boxShadow='inset 0 0 0 2px #1a1033';
      c.title=`${AW[i]} → ${AW[j]}: ${j<=i?Math.round(v*100)+'%':'masked'}`;c.onclick=()=>{aSel=i;drawAtt()};grid.appendChild(c)})});
  wrap.append(labels,grid);
}
$$('#headSeg button').forEach(b=>b.onclick=()=>{head=b.dataset.head;seenHeads.add(head);if(seenHeads.size>=3)award('heads');$$('#headSeg button').forEach(x=>x.setAttribute('aria-pressed',x===b));drawAtt();blip(660)});
drawAtt();

/* ---------- attention lab ---------- */
const DIMS=['noun','legal instrument','person / actor','action'];
const LK=[[.1,0,0,0],[1.5,.2,1.2,0],[0,0,.2,1.5],[.1,0,0,.2],[.1,0,0,0],[1.6,1.8,0,0],[0,0,0,.6],[.2,.6,0,.4],[0,0,0,.3],[.8,0,0,0],[0,.3,0,1.6],[.1,0,0,0],[1.4,.2,1.8,0],[.6,0,.8,0]];
const LV=[[0,0,0,0],[1,.1,1,0],[0,0,0,1],[0,0,0,.1],[0,0,0,0],[1,1,0,0],[0,0,0,.3],[0,.4,0,.3],[0,0,0,.2],[.4,0,0,0],[0,.2,0,1],[0,0,0,0],[1,.1,1,0],[.3,0,.4,0]];
const LP={it:{pos:9,q:[2,1.5,.3,-.5],why:'"it" is a pronoun. Its query asks for an earlier <b>noun</b>, preferably a <b>legal instrument</b> (something that can be void), and it gives a slight negative to actions because a pronoun never stands in for a verb.'},
  who:{pos:13,q:[1,0,2,-.3],why:'"who" starts a description of a person, so its query asks mainly for a <b>person / actor</b> noun. Watch "court" come a close second, because a court is also an actor. That ambiguity is real, and later layers and other heads help settle it.'},
  void:{pos:7,q:[1.5,1.2,0,0],why:'"void" is a legal status. Its query looks for the <b>legal instrument</b> that has that status.'},
  held:{pos:2,q:[.5,0,2,0],why:'"held" is a verb, and its query asks "who did the holding?" It looks for an <b>actor</b>. Only two earlier words exist, which shows how little context the first few words get.'}};
let labP='it',labQv=LP.it.q.slice();
const cellBg=v=>v>0?`rgba(255,45,149,${Math.min(.85,v/2.2).toFixed(2)})`:v<0?`rgba(47,140,255,${Math.min(.85,-v/1.2).toFixed(2)})`:'#fff';
const vecHTML=v=>'<span class="vec">'+v.map(x=>`<span style="background:${cellBg(x)}">${x.toFixed(1)}</span>`).join('')+'</span>';
const fmt=x=>{const r=Math.round(x*100)/100;return (r<0?'−':'')+Math.abs(r).toFixed(Math.abs(r)%1&&Math.abs(r*10)%1?2:1)};
function labSliders(){const box=$('#labQ');box.innerHTML='';DIMS.forEach((d,i)=>{const l=document.createElement('label');l.innerHTML=`<span class="qv"><span>${d}</span><output id="labO${i}">${labQv[i].toFixed(1)}</output></span><input type="range" id="labS${i}" min="-1" max="3" step="0.1" value="${labQv[i]}" aria-label="query: ${d}">`;box.appendChild(l);
  l.querySelector('input').addEventListener('input',e=>{labQv[i]=+e.target.value;$('#labO'+i).textContent=labQv[i].toFixed(1);labRender()})})}
function labRender(){
  const P=LP[labP],pos=P.pos,q=labQv,rows=[];
  for(let j=0;j<=pos;j++){const k=LK[j];const dot=q.reduce((s,x,i)=>s+x*k[i],0);rows.push({j,k,dot,sc:dot/2})}
  rows.forEach(r=>r.e=Math.exp(r.sc));const S=rows.reduce((s,r)=>s+r.e,0);rows.forEach(r=>r.w=r.e/S);
  const best=rows.reduce((a,b)=>b.w>a.w?b:a);if(labP==='it'&&best.j===5)award('party');
  $('#labWhy').innerHTML=`<b>Query from “${AW[pos]}”:</b> `+P.why;
  let h=`<thead><tr><th>Earlier word</th><th>① Key k (name tag)</th><th>② Score q · k</th><th>③ ÷ √4</th><th>④ e<sup>x</sup></th><th>⑤ Weight</th><th>Value v (backpack)</th></tr></thead><tbody>`;
  rows.forEach(r=>{const terms=q.map((x,i)=>`${fmt(x)}×${fmt(r.k[i])}`).join(' + ');
    h+=`<tr class="${r.j===pos?'self':r===best?'top':''}"><td>${esc(AW[r.j])}${r.j===pos?' <span class="tip">(itself)</span>':''}</td><td>${vecHTML(r.k)}</td><td class="ms">${terms} = <b>${fmt(r.dot)}</b></td><td class="ms">${r.sc.toFixed(2)}</td><td class="ms">${r.e.toFixed(2)}</td><td><div class="wbar"><div class="tr"><i style="width:${(r.w*100).toFixed(1)}%"></i></div><span class="ms">${(r.w*100).toFixed(1)}%</span></div></td><td>${vecHTML(LV[r.j])}</td></tr>`});
  h+=`</tbody><tfoot><tr><th colspan="4" style="text-align:right">Total of column ④ =</th><th class="ms" style="color:var(--ink)">${S.toFixed(2)}</th><th class="ms" style="color:var(--ink)">100%</th><th></th></tr></tfoot>`;
  $('#labTbl').innerHTML=h;
  const out=[0,0,0,0];rows.forEach(r=>LV[r.j].forEach((v,i)=>out[i]+=r.w*v));
  const before=LV[pos];const cosv=(a,b)=>{const d=a.reduce((s,x,i)=>s+x*b[i],0),na=Math.hypot(...a),nb=Math.hypot(...b);return na&&nb?d/(na*nb):0};
  const near=rows.filter(r=>r.j!==pos&&Math.hypot(...LV[r.j])>0).map(r=>({j:r.j,c:cosv(out,LV[r.j])})).sort((a,b)=>b.c-a.c);
  const contrib=rows.slice().sort((a,b)=>b.w-a.w).slice(0,3);
  $('#labOut').innerHTML=`<div><h4>⑥ Blend the values: new vector for “${AW[pos]}”</h4>`+
    contrib.map((r,ix)=>`<div class="line">${ix?'+':'&nbsp;&nbsp;'} <span class="ms">${r.w.toFixed(2)} ×</span> ${esc(AW[r.j])} ${vecHTML(LV[r.j])}</div>`).join('')+
    `<div class="line">+ <span class="tip">${rows.length>3?(rows.length-3)+' smaller terms':'nothing else'}</span></div><div class="line" style="border-top:2px solid var(--ink);padding-top:5px">= ${vecHTML(out)} <span class="tip">(${DIMS.join(' · ')})</span></div>`+
    `<div class="live" style="margin-top:8px">Check one weight: a(“${esc(AW[best.j])}”) = e<sup>${best.sc.toFixed(2)}</sup> ÷ ${S.toFixed(2)} = ${best.e.toFixed(2)} ÷ ${S.toFixed(2)} = <b>${best.w.toFixed(3)}</b></div></div>`+
    `<div><h4>Before vs after</h4><div class="line">before: ${vecHTML(before)}</div><div class="line">after:&nbsp;&nbsp; ${vecHTML(out)}</div>`+
    (near[0]?`<p style="font-size:15px;margin-top:8px">Before attention, “${AW[pos]}” carried only its own small vector. After, its vector points most like <b>${esc(AW[near[0].j])}</b> (cosine ${near[0].c.toFixed(2)})${near[1]?`, then ${esc(AW[near[1].j])} (${near[1].c.toFixed(2)})`:''}. That's the whole trick: the word has absorbed the meaning of what it refers to, and every later layer works with this enriched vector.</p>`:'')+
    `<p class="tip" style="margin-top:6px">In a real model this blended vector also passes through one more learned matrix (W<sub>O</sub>) and is added back onto the original vector (the residual connection) rather than replacing it.</p></div>`;
}
$$('#labSeg button').forEach(b=>b.onclick=()=>{labP=b.dataset.p;labQv=LP[labP].q.slice();$$('#labSeg button').forEach(x=>x.setAttribute('aria-pressed',x===b));labSliders();labRender();blip(560)});
labSliders();labRender();
  }};
TOYS.heads={title:'Three Heads',short:'Three Heads',level:4,color:'var(--tang)',tb1:'var(--tang)',tb2:'var(--pink)',icon:ICONS.heads,
  help:'Click a word to see which earlier words it attends to.',
  html:`      <div class="canvas" style="display:grid;gap:12px">
        <p style="font-size:16px"><b>Now zoom out.</b> Below is the same sentence with three different heads. Each arc is one weight from step ⑤, drawn from the word you click back to the words it attends to. A full model runs dozens of these heads in parallel in every layer.</p>
        <div class="row">
          <span class="label">Head:</span>
          <div class="seg" id="headSeg">
            <button type="button" data-head="ref" aria-pressed="true">Who's "it"?</button>
            <button type="button" data-head="gram" aria-pressed="false">Who did what</button>
            <button type="button" data-head="legal" aria-pressed="false">Legal meaning</button>
          </div>
        </div>
        <div class="scroll-x"><svg class="att-svg" id="attSvg" viewBox="0 0 900 230" role="img" aria-label="Attention arcs"></svg></div>
        <p id="attNote" style="font-size:16.5px"></p>
      </div>
      <div class="two">
        <div class="canvas" style="display:grid;gap:8px">
          <span class="label">The full attention matrix (click a row)</span>
          <div class="scroll-x"><div class="heat-wrap" id="heatWrap"></div></div>
          <p class="tip">The top-right half is blank on purpose: a word can only look backward. The model writes left to right, so it may not peek at words it hasn't written yet.</p>
        </div>
        <div style="display:grid;gap:12px;align-content:start">
          <div class="sticky-note"><h3>Why the first word glows</h3><p>Heads with nothing useful to look at dump their attention on the first token. Researchers call it an "attention sink." It's a real quirk of trained models, and you can see it in column one.</p></div>
          <div class="ml-link"><b>Why this mattered</b>Older models (RNNs) passed memory along one word at a time and forgot long-range links. Attention lets any word reach any earlier word in one hop, and it parallelizes on GPUs. That combination is what made today's scale possible.</div>
        </div>
      </div>`};
