/* ==== TOY: the big picture (system map + "trace a question"). Ported from v1. ==== */
const MAPTOY={agents:'agents',tokens:'tokens',embeddings:'embeddings',attention:'attention',sampling:'dice',rag:'rag'};
function gotoToyTab(tab){const id=MAPTOY[tab]||tab;if(TOYS[id])UI.openToy(id)}
TOYS.map={title:'The Big Picture',short:'Big Picture',level:0,color:'var(--lemon)',tb1:'var(--grape)',tb2:'var(--pink)',icon:ICONS.sysmap,
  help:'Click any box to open its toy, or trace one question through the whole system.',
  html:`<div class="canvas scroll-x"><svg class="map-svg" id="mapSvg" viewBox="0 0 960 520" role="img" aria-label="System map of an AI research agent"></svg></div>
<div class="canvas trace-cap">
  <div class="trace-num" id="traceNum">?</div>
  <div style="display:grid;gap:8px;min-width:0">
    <p id="traceText">Press <b>Trace a question</b> to follow: <i>"Does a no-contest clause bar a beneficiary who sues with probable cause?"</i></p>
    <div class="row">
      <button class="btn pink" id="traceBack" type="button">◀ Back</button>
      <button class="btn" id="traceNext" type="button">Trace a question ▶</button>
      <button class="btn lemon small" id="traceGo" type="button" hidden>Open this toy</button>
    </div>
  </div>
</div>`,
  init(){
const NODES={
  you:{x:20,y:215,w:130,h:70,t:'You',s:'ask a question',fill:C.paper,tab:'agents',hint:'You: the person with the task.'},
  plan:{x:215,y:62,w:150,h:62,t:'Plan',s:'LLM writes reasoning',fill:C.grapeL,tab:'agents',hint:'Plan: the LLM thinks about what to do next.'},
  act:{x:390,y:62,w:150,h:62,t:'Act',s:'emit a tool call',fill:C.tangL,tab:'agents',hint:'Act: the LLM writes a structured tool call.'},
  observe:{x:565,y:62,w:150,h:62,t:'Observe',s:'read tool result',fill:C.skyL,tab:'agents',hint:'Observe: the tool result gets pasted into the context window.'},
  tok:{x:210,y:300,w:118,h:66,t:'Tokenizer',s:'text → IDs',fill:C.pinkL,tab:'tokens',hint:'Tokenizer: chops text into token IDs.'},
  emb:{x:345,y:300,w:118,h:66,t:'Embed',s:'IDs → vectors',fill:C.limeL,tab:'embeddings',hint:'Embedding: each token becomes a vector of numbers.'},
  att:{x:480,y:300,w:118,h:66,t:'Attention',s:'× many layers',fill:C.tangL,tab:'attention',hint:'Transformer layers: attention mixes information between tokens.'},
  samp:{x:615,y:300,w:118,h:66,t:'Sample',s:'pick next token',fill:C.skyL,tab:'sampling',hint:'Sampling: probabilities over the vocabulary, pick one, repeat.'},
  ret:{x:790,y:40,w:150,h:62,t:'Retriever',s:'RAG search tool',fill:C.grapeL,tab:'rag',hint:'Retriever: the RAG tool. Embeds the query and searches.'},
  vec:{x:790,y:140,w:150,h:62,t:'Vector index',s:'embedded chunks',fill:C.limeL,tab:'rag',hint:'Vector index: your documents, chunked and embedded ahead of time.'},
  cit:{x:790,y:240,w:150,h:62,t:'Citator',s:'verify authority',fill:C.pinkL,tab:'agents',hint:'Citator: a verification tool. Does this case exist? Is it good law?'},
  ans:{x:400,y:430,w:190,h:66,t:'Answer',s:'grounded + cited',fill:C.lemonL,tab:'rag',hint:'The final answer, grounded in retrieved sources.'}
};
const WIRES=[
  ['you','plan','M150 240 C190 240 180 93 213 93'],
  ['plan','act','M365 93 L388 93'],
  ['act','observe','M540 93 L563 93'],
  ['observe','plan','M640 62 C640 26 290 26 290 60'],
  ['act','ret','M465 124 L465 200 L765 200 L765 71 L788 71'],
  ['ret','vec','M865 102 L865 138'],
  ['act','cit','M465 124 L465 200 L765 200 L765 271 L788 271'],
  ['ret','observe','M790 93 L717 93'],
  ['plan','tok','M262 124 L262 298'],
  ['tok','emb','M328 333 L343 333'],
  ['emb','att','M463 333 L478 333'],
  ['att','samp','M598 333 L613 333'],
  ['samp','plan','M674 300 L674 232 L312 232 L312 126'],
  ['samp','ans','M674 366 C674 420 640 463 592 463']
];
const mapSvg=$('#mapSvg'), nodeEls={}, wireEls={};
(function drawMap(){
  const defs=el('defs',{},mapSvg);
  const m=el('marker',{id:'arr',viewBox:'0 0 10 10',refX:'8',refY:'5',markerWidth:'7',markerHeight:'7',orient:'auto-start-reverse'},defs);
  el('path',{d:'M0 0L10 5L0 10z',fill:C.ink},m);
  // frames
  el('rect',{x:195,y:12,width:540,height:136,rx:14,class:'frame-r'},mapSvg);
  el('text',{x:208,y:142,class:'frame-t'},mapSvg).textContent='AGENT LOOP';
  el('rect',{x:195,y:262,width:555,height:132,rx:14,class:'frame-r'},mapSvg);
  el('text',{x:208,y:386,class:'frame-t'},mapSvg).textContent='LLM';
  el('text',{x:244,y:386,'font-family':'Comic Neue, sans-serif','font-size':'13',fill:C.ink},mapSvg).textContent='reads the whole context window · ↻ runs once per token';
  el('rect',{x:775,y:12,width:180,height:318,rx:14,class:'frame-r'},mapSvg);
  el('text',{x:790,y:322,class:'frame-t'},mapSvg).textContent='TOOLS';
  el('text',{x:752,y:84,'font-family':'Comic Neue, sans-serif','font-size':'12',fill:C.ink,'text-anchor':'middle'},mapSvg).textContent='results';
  el('text',{x:612,y:194,'font-family':'Comic Neue, sans-serif','font-size':'12',fill:C.ink,'text-anchor':'middle'},mapSvg).textContent='tool calls';
  el('text',{x:270,y:216,'font-family':'Comic Neue, sans-serif','font-size':'12',fill:C.ink},mapSvg).textContent='prompt ↓';
  el('text',{x:318,y:182,'font-family':'Comic Neue, sans-serif','font-size':'12',fill:C.ink},mapSvg).textContent='↑ generated text';
  WIRES.forEach(([a,b,d])=>{wireEls[a+'-'+b]=el('path',{d,class:'wire','marker-end':'url(#arr)'},mapSvg)});
  for(const id in NODES){
    const n=NODES[id];
    const g=el('g',{class:'node',tabindex:'0',role:'button','aria-label':n.t+': '+n.s,'data-hint':n.hint+' Click to open.'},mapSvg);
    el('rect',{x:n.x,y:n.y,width:n.w,height:n.h,rx:12,fill:n.fill},g);
    el('rect',{x:n.x+6,y:n.y+4,width:n.w-12,height:9,rx:4.5,fill:'#fff',opacity:.6,class:'gl'},g);
    const t=el('text',{x:n.x+n.w/2,y:n.y+n.h/2-2,'text-anchor':'middle'},g);t.textContent=n.t;
    const s=el('text',{x:n.x+n.w/2,y:n.y+n.h/2+16,'text-anchor':'middle',class:'sub'},g);s.textContent=n.s;
    g.style.transformBox='fill-box';
    g.onclick=()=>gotoToyTab(n.tab);
    g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();gotoToyTab(n.tab)}};
    nodeEls[id]=g;
  }
})();
const TRACE=[
  {n:['you'],w:[],t:'You type the task: <i>"Does a no-contest clause bar a beneficiary who sues with probable cause? Cite and verify."</i> The agent code wraps it with instructions and a list of available tools.',tab:'agents'},
  {n:['plan'],w:['you-plan'],t:'The agent asks the LLM: given this task and these tools, what should happen next? Every "thought" is a full trip through the LLM.',tab:'agents'},
  {n:['tok','emb'],w:['plan-tok','tok-emb'],t:'Inside the LLM, the whole context (instructions + task + anything gathered so far) is tokenized and each token becomes an embedding vector.',tab:'tokens'},
  {n:['att'],w:['emb-att'],t:'Dozens of transformer layers let every token attend to the earlier ones, building up an understanding of the request.',tab:'attention'},
  {n:['samp','plan'],w:['att-samp','samp-plan'],t:'The model samples its reply one token at a time: <i>"I should search the firm memos for no-contest clauses and probable cause."</i>',tab:'sampling'},
  {n:['act','ret'],w:['plan-act','act-ret'],t:'It emits a tool call: <code>kb_search("no-contest clause probable cause")</code>. Ordinary code runs it, not the model.',tab:'rag'},
  {n:['ret','vec'],w:['ret-vec'],t:'The retriever embeds the query and pulls the nearest chunks from the vector index. This is the "R" in RAG.',tab:'rag'},
  {n:['observe','plan'],w:['ret-observe','observe-plan'],t:'The chunks are pasted into the context window. The loop goes around again with more information to plan from.',tab:'agents'},
  {n:['act','cit'],w:['act-cit'],t:'Before citing anything, the agent calls the citator to confirm each authority exists and is still good law. This catches hallucinated cases.',tab:'agents'},
  {n:['samp','ans'],w:['samp-ans'],t:'Satisfied, the LLM writes the final answer, citing only the retrieved and verified sources. Done!',tab:'rag'}
];
let ti=-1;
function paintTrace(){
  Object.values(nodeEls).forEach(g=>g.classList.remove('lit'));
  Object.values(wireEls).forEach(w=>w.classList.remove('lit'));
  const goBtn=$('#traceGo');
  if(ti<0){$('#traceNum').textContent='?';$('#traceText').innerHTML='Press <b>Trace a question</b> to follow: <i>"Does a no-contest clause bar a beneficiary who sues with probable cause?"</i>';$('#traceNext').textContent='Trace a question ▶';goBtn.hidden=true;return}
  const s=TRACE[ti];
  s.n.forEach(id=>nodeEls[id].classList.add('lit'));
  s.w.forEach(id=>wireEls[id]&&wireEls[id].classList.add('lit'));
  $('#traceNum').textContent=ti+1;
  $('#traceText').innerHTML=s.t;
  $('#traceNext').textContent=ti===TRACE.length-1?'Start over ↺':'Next ▶';
  goBtn.hidden=false;goBtn.onclick=()=>gotoToyTab(s.tab);
}
$('#traceNext').onclick=()=>{ti=ti>=TRACE.length-1?-1:ti+1;SND.play('click');paintTrace()};
$('#traceBack').onclick=()=>{ti=Math.max(-1,ti-1);SND.play('click');paintTrace()};
paintTrace();

  }};
