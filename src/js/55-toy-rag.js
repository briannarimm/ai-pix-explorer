/* ==== TOY: RAG Library, ported from v1 ==== */
TOYS.rag={title:'RAG Library',short:'RAG Library',level:10,color:'var(--grape)',tb1:'var(--grape)',tb2:'var(--sky)',icon:ICONS.rag,
  help:'Eight fictional memos. Retrieval is a word-overlap stand-in; real systems use learned embeddings.',
  html:`      <div class="pipe" id="pipe">
        <div class="pstep" data-s="0"><b>1 · Chunk</b>Split documents into passages</div>
        <div class="pstep" data-s="1"><b>2 · Embed</b>Turn question into a vector</div>
        <div class="pstep" data-s="2"><b>3 · Retrieve</b>Find the top-k nearest chunks</div>
        <div class="pstep" data-s="3"><b>4 · Augment</b>Paste them into the prompt</div>
        <div class="pstep" data-s="4"><b>5 · Generate</b>Answer with citations</div>
      </div>
      <div class="canvas" style="display:grid;gap:10px">
        <label class="label" for="ragQ">Ask the firm knowledge base</label>
        <input type="text" id="ragQ" value="Can a beneficiary challenge a trust without losing their share under a no-contest clause?">
        <div class="row">
          <button class="btn small lemon" type="button" data-rq="What does a complaint need to survive a motion to dismiss?">Motion to dismiss</button>
          <button class="btn small lemon" type="button" data-rq="What are the elements of adverse possession?">Adverse possession</button>
          <button class="btn small lemon" type="button" data-rq="Do we have to check citations before filing a brief?">Citation policy</button>
          <button class="btn small lemon" type="button" data-rq="Who won the 1998 World Series?">Off-topic</button>
        </div>
        <div class="row">
          <label class="slider-row" style="flex:1;min-width:240px"><span>Top-k chunks</span><input type="range" id="topk" min="1" max="4" value="2"><output id="topkOut">2</output></label>
          <label class="toggle"><input type="checkbox" id="ragOn" checked> Retrieval ON</label>
          <button class="btn grape" type="button" id="ragGo">Run the pipeline ▶</button>
        </div>
      </div>
      <div class="two">
        <div class="canvas" style="display:grid;gap:8px;align-content:start">
          <span class="label" id="chunkHead">Step 3 · Similarity of every chunk to your question</span>
          <div class="chunks" id="chunks"></div>
        </div>
        <div style="display:grid;gap:12px;align-content:start;min-width:0">
          <div class="canvas" style="display:grid;gap:8px">
            <span class="label">Step 4 · The prompt the LLM actually sees</span>
            <div class="prompt-box" id="promptBox"></div>
          </div>
          <div class="canvas" style="display:grid;gap:8px">
            <span class="label">Step 5 · Answer</span>
            <div class="answer" id="answer"></div>
          </div>
        </div>
      </div>
      <div class="nerd">
        <div class="nerd-h"><svg viewBox="0 0 30 16" aria-hidden="true"><circle cx="7" cy="8" r="5.5" fill="#fff" stroke="#1a1033" stroke-width="2"/><circle cx="23" cy="8" r="5.5" fill="#fff" stroke="#1a1033" stroke-width="2"/><path d="M12.5 7h5" stroke="#1a1033" stroke-width="2"/></svg>NERD MODE · the math</div>
        <div class="nerd-b">
          <div class="eqs">
            <div class="eq"><span class="cap">Index once, ahead of time (one vector per chunk):</span><b>v</b><sub><i>k</i></sub> = <i>E</i>(<i>d</i><sub><i>k</i></sub>) &nbsp;&nbsp; for every chunk <i>d</i><sub><i>k</i></sub></div>
            <div class="eq"><span class="cap">Retrieve at question time (k-nearest neighbours):</span><i>D</i><sub><i>q</i></sub> = top-<i>k</i><sub> <i>k</i></sub> &nbsp;cos(<i>E</i>(<i>q</i>), <b>v</b><sub><i>k</i></sub>)</div>
            <div class="eq"><span class="cap">This demo's stand-in for <i>E</i>: TF-IDF weights (rare shared words count more):</span><i>w</i><sub><i>t</i>,<i>d</i></sub> = tf<sub><i>t</i>,<i>d</i></sub> · log <span class="frac"><span><i>N</i> + 1</span><span>df<sub><i>t</i></sub> + 0.5</span></span></div>
            <div class="eq"><span class="cap">Generate, conditioned on the retrieved text (the model's weights never change):</span><i>p</i>(<i>y</i> | <i>q</i>) = <span class="big">Π</span><sub><i>t</i></sub> <i>p</i>(<i>y</i><sub><i>t</i></sub> | <i>q</i>, <i>D</i><sub><i>q</i></sub>, <i>y</i><sub>&lt;<i>t</i></sub>)</div>
            <div class="eq"><span class="cap">Original RAG paper's view: average over which document is "the right one":</span><i>p</i>(<i>y</i> | <i>q</i>) ≈ <span class="big">Σ</span><sub><i>d</i> ∈ <i>D</i><sub><i>q</i></sub></sub> <i>p</i>(<i>d</i> | <i>q</i>) · <i>p</i>(<i>y</i> | <i>q</i>, <i>d</i>)</div>
            <div class="live" id="liveRag">Run the pipeline to see the numbers.</div>
          </div>
          <div class="where">
            <span class="label">Where</span>
            <div><b>E(·)</b><span>an embedding model that maps text to one vector</span></div>
            <div><b>q</b><span>the question; <i>d<sub>k</sub></i> the <i>k</i>-th chunk</span></div>
            <div><b>tf<sub>t,d</sub></b><span>how often term <i>t</i> appears in chunk <i>d</i></span></div>
            <div><b>df<sub>t</sub></b><span>how many chunks contain <i>t</i>; <i>N</i> = number of chunks (8 here)</span></div>
            <div><b>p(d | q)</b><span>how relevant the retriever thinks <i>d</i> is</span></div>
            <div><b>Recall@k</b><span>share of questions whose right chunk lands in the top <i>k</i>: the retriever's report card</span></div>
          </div>
        </div>
      </div>
      <p class="tip">The knowledge base is eight short memos written for this demo. They aren't legal authority, and the cases are generic. To keep everything in your browser, retrieval here scores word overlap plus a small synonym list. Real systems use learned embeddings, which match meaning even with zero shared words, and often combine both ("hybrid search").</p>`,
  init(){
const KB=[
  {id:'M-101',title:'No-contest clauses: general enforceability',src:'Trusts & Estates memo',text:'No-contest (in terrorem) clauses in wills and trusts are generally enforced, so a beneficiary who contests the instrument can forfeit their share. Many jurisdictions, following Uniform Probate Code § 3-905, will not enforce the penalty if the beneficiary had probable cause to bring the challenge.',ans:'No-contest clauses are generally enforceable, but many jurisdictions refuse to apply the forfeiture when the beneficiary had probable cause to bring the challenge.'},
  {id:'M-102',title:'No-contest clauses: pre-filing safe harbor',src:'Trusts & Estates memo',text:'Some states let a beneficiary petition the court before filing to ask whether a proposed action would trigger a no-contest clause in the trust or will. A favorable ruling lets the beneficiary challenge or contest without risking forfeiture of their share. Check the governing state statute for scope and timing.',ans:'Some states also offer a safe harbor: the beneficiary can ask the court in advance whether a proposed challenge would trigger the clause.'},
  {id:'M-201',title:'Motion to dismiss: plausibility standard',src:'Litigation memo',text:'To survive a federal motion to dismiss under Rule 12(b)(6), a complaint must plead enough facts to state a claim that is plausible on its face (Twombly; Iqbal). Legal conclusions and formulaic recitals of elements are not enough; the court accepts well-pleaded factual allegations as true.',ans:'A complaint needs enough factual allegations to make the claim plausible; bare legal conclusions don\'t count.'},
  {id:'M-202',title:'Statutes of limitation: contract claims',src:'Litigation memo',text:'Limitation periods for breach of contract claims differ by state and often differ between written and oral contracts. Always confirm the governing statute and when the claim accrued.',ans:'Limitation periods for contract claims vary by state and contract type, so confirm the statute.'},
  {id:'M-301',title:'Adverse possession: elements',src:'Real estate memo',text:'Adverse possession generally requires possession of land that is actual, open and notorious, exclusive, hostile (under a claim of right), and continuous for the statutory period. The length of the period and any tax-payment requirements vary by state.',ans:'Adverse possession requires actual, open and notorious, exclusive, hostile, and continuous possession for the statutory period, which varies by state.'},
  {id:'M-302',title:'Negligence: elements',src:'Torts memo',text:'A negligence claim requires a duty of care, breach of that duty, causation (both actual and proximate cause), and damages.',ans:'Negligence requires duty, breach, causation, and damages.'},
  {id:'P-001',title:'Firm policy: citation verification',src:'Firm policy manual',text:'Every case, statute, and quotation cited in a brief or filing must be verified in a citator before filing, including any authority suggested by an AI tool. The filing attorney is responsible for confirming each citation exists and remains good law.',ans:'Yes. Firm policy requires every citation, including any an AI tool suggested, to be verified in a citator before filing.'},
  {id:'P-002',title:'Discovery: privilege logs',src:'Firm policy manual',text:'When withholding documents in discovery on privilege grounds, prepare a privilege log describing each withheld document with enough detail to assess the claim, without revealing privileged content.',ans:'Withheld documents need a privilege log detailed enough to assess the claim.'}
];
const STOP=new Set('a an the of to in on for and or is are was be by as at it its that this with from can do does we our you your what who how under their they them without before after any have has must not if'.split(' '));
const SYN={'no-contest':['contest','terrorem','forfeit','forfeiture'],contest:['no-contest','challenge','terrorem'],challenge:['contest','no-contest'],lose:['forfeit','forfeiture'],losing:['forfeit','forfeiture'],share:['forfeit','beneficiary'],trust:['will','trusts'],dismiss:['12(b)(6)','plausible','complaint'],survive:['plausible','dismiss'],complaint:['plead','dismiss'],citations:['citation','citator','cite'],check:['verify','verified','citator'],brief:['filing','filed'],filing:['brief','filed'],elements:['requires','require'],squatter:['adverse','possession'],sue:['claim'],deadline:['limitation','period'],late:['limitation']};
const norm=w=>w.toLowerCase().replace(/[^a-z0-9()\-§.]/g,'').replace(/^[.]+|[.]+$/g,'');
const stem=w=>w.length>4?w.replace(/(ings|ing|ies|es|s|ed)$/,''):w;
const terms=s=>s.split(/\s+/).map(norm).filter(w=>w&&!STOP.has(w)).map(stem);
const DOCT=KB.map(d=>terms(d.title+' '+d.text));
const DF={};DOCT.forEach(ts=>new Set(ts).forEach(t=>DF[t]=(DF[t]||0)+1));
const idf=t=>Math.log((KB.length+1)/((DF[t]||0)+.5));
function vec(ts){const v={};ts.forEach(t=>v[t]=(v[t]||0)+idf(t));return v}
function cos(a,b){let d=0,na=0,nb=0;for(const k in a){na+=a[k]*a[k];if(b[k])d+=a[k]*b[k]}for(const k in b)nb+=b[k]*b[k];return na&&nb?d/Math.sqrt(na*nb):0}
const DV=DOCT.map(vec);
function queryVec(q){const base=q.split(/\s+/).map(norm).filter(w=>w&&!STOP.has(w));const all=[];base.forEach(w=>{all.push(stem(w));(SYN[w]||[]).forEach(s=>all.push(stem(s)))});return vec(all)}
let ragTimer=null;
function runRag(){
  clearTimeout(ragTimer);
  const q=$('#ragQ').value.trim()||'(empty question)';const k=+$('#topk').value;const on=$('#ragOn').checked;
  const steps=$$('.pstep');steps.forEach(s=>s.classList.remove('on'));
  const scored=KB.map((d,i)=>({d,i,s:cos(queryVec(q),DV[i])})).sort((a,b)=>b.s-a.s);
  const top=on?scored.slice(0,k).filter(x=>x.s>0.06):[];
  const box=$('#chunks');box.innerHTML='';$('#promptBox').innerHTML='';$('#answer').innerHTML='<span class="tip">Waiting…</span>';
  $('#chunkHead').textContent=on?'Step 3 · Similarity of every chunk to your question':'Retrieval is OFF: nothing gets looked up';
  const seq=on?[0,1,2,3,4]:[4];let n=0;
  const tick=()=>{if(n>0)steps[seq[n-1]].classList.remove('on');if(n>=seq.length)return finish();steps[seq[n]].classList.add('on');blip(500+n*90);
    if(seq[n]===2)renderChunks(scored,top);if(seq[n]===3||(!on&&seq[n]===4))renderPrompt(q,top,on);n++;ragTimer=setTimeout(tick,matchMedia('(prefers-reduced-motion: reduce)').matches?0:420)};
  const finish=()=>{steps[4].classList.add('on');renderAnswer(q,top,on);if(on)award('openbook')};
  if(!on){box.innerHTML='<p class="tip">With retrieval off, the model gets only your question and answers from whatever it absorbed in training.</p>'}
  tick();
}
function renderChunks(scored,top){const box=$('#chunks');box.innerHTML='';const max=Math.max(.0001,scored[0].s);const topIds=new Set(top.map(t=>t.d.id));
  scored.forEach((x,rank)=>{const c=document.createElement('div');c.className='chunk'+(topIds.has(x.d.id)?' top':'');c.id='chunk-'+x.d.id;
    c.innerHTML=`<div class="meta"><span>#${rank+1} · ${x.d.id}</span><span>${x.s.toFixed(2)}</span></div><b style="font-size:14.5px">${esc(x.d.title)}</b><div class="score-bar"><i style="width:${x.s/max*100}%"></i></div>${topIds.has(x.d.id)?'<span class="stamp good" style="justify-self:start">RETRIEVED</span>':''}`;
    c.dataset.hint=x.d.text;box.appendChild(c)})}
function renderPrompt(q,top,on){const ctx=on?(top.length?top.map((t,i)=>`[${i+1}] (${t.d.id}) ${t.d.text}`).join('\n\n'):'(no chunk scored above the relevance threshold)'):'';
  $('#promptBox').innerHTML=(on?`<span class="sys">SYSTEM: Answer ONLY from the sources below. Cite them like [1]. If the sources don't answer the question, say so.</span>\n\n<span class="ctx">SOURCES:\n${esc(ctx)}</span>\n\n`:`<span class="sys">SYSTEM: You are a helpful legal research assistant.</span>\n\n`)+`<span class="q">USER: ${esc(q)}</span>`}
function renderAnswer(q,top,on){const a=$('#answer');
  const sc=KB.map((d,i)=>cos(queryVec(q),DV[i]));const best=Math.max(...sc);const bi=sc.indexOf(best);
  const qv=queryVec(q);const shared=Object.keys(qv).filter(t=>DV[bi][t]).slice(0,5);
  $('#liveRag').innerHTML=on?`Best chunk ${KB[bi].id}: cos(q, d) = <b>${best.toFixed(3)}</b>, from shared terms {${shared.map(esc).join(', ')||'none'}}. Relevance cutoff = 0.06 · kept ${top.length} of top-${$('#topk').value}.`:'Retrieval is off: D<sub>q</sub> = ∅, so p(y | q) depends on the model\'s weights alone.';
  if(!on){a.innerHTML=`<p>Courts usually enforce these provisions, as held in <i>Whitfield v. Whitfield Trust</i>, 233 S.W.3d 801 (Mo. App. 2008), though outcomes depend on the facts.</p><div><span class="stamp bad">UNSOURCED</span> Sounds confident. Nothing was retrieved, so there's nothing to check it against, and the case was invented for this demo to show the failure.</div>`;return}
  if(!top.length){a.innerHTML=`<p>I couldn't find anything in the knowledge base that answers this, so I won't guess.</p><div><span class="stamp good">GROUNDED REFUSAL</span> Low similarity scores are a useful signal. A well-built RAG system declines instead of making something up.</div>`;return}
  a.innerHTML='<p>'+top.map((t,i)=>`${esc(t.d.ans)} <button class="cite" type="button" data-c="${t.d.id}" data-hint="Jump to source ${t.d.id}">[${i+1}]</button>`).join(' ')+'</p><div><span class="stamp good">GROUNDED</span> Every sentence traces to a retrieved chunk. Click a citation to check it.</div>'+(top.length<+$('#topk').value?'<p class="tip">Fewer chunks than top-k: the rest scored below the relevance cutoff.</p>':'');
  a.querySelectorAll('.cite').forEach(b=>b.onclick=()=>{award('citechecker');const c=$('#chunk-'+b.dataset.c);if(c){c.scrollIntoView({behavior:'smooth',block:'center'});c.animate&&c.animate([{transform:'scale(1.04)'},{transform:'scale(1)'}],{duration:400});$('#hint').textContent=KB.find(d=>d.id===b.dataset.c).text}})}
$('#topk').addEventListener('input',()=>{$('#topkOut').textContent=$('#topk').value});
$('#ragGo').onclick=runRag;$('#ragQ').addEventListener('keydown',e=>{if(e.key==='Enter')runRag()});
$$('[data-rq]').forEach(b=>b.onclick=()=>{$('#ragQ').value=b.dataset.rq;runRag()});
$('#ragOn').onchange=runRag;
// initial static state (no animation)
(function(){const q=$('#ragQ').value;const scored=KB.map((d,i)=>({d,i,s:cos(queryVec(q),DV[i])})).sort((a,b)=>b.s-a.s);const top=scored.slice(0,2).filter(x=>x.s>.06);renderChunks(scored,top);renderPrompt(q,top,true);renderAnswer(q,top,true);$$('.pstep')[4].classList.add('on')})();
  }};
