/* ==== TOY: Agent Loop-de-Loop, ported from v1 ==== */
TOYS.agents={title:'Agent Loop',short:'Agent Loop',level:11,color:'var(--pink)',tb1:'var(--pink)',tb2:'var(--grape)',icon:ICONS.agents,
  help:'Step through a scripted agent run. Then skip the citator and see what slips through.',
  html:`      <div class="agent-grid">
        <div class="canvas" style="display:grid;gap:12px;justify-items:center">
          <svg class="ring-svg" id="ringSvg" viewBox="0 0 260 260" role="img" aria-label="Plan, act, observe loop"></svg>
          <div style="width:100%;display:grid;gap:4px">
            <span class="label">Context window used</span>
            <div class="meter"><i id="agCtx" style="width:0"></i><span id="agCtxTxt">0 tokens</span></div>
          </div>
          <div style="width:100%;display:grid;gap:4px">
            <span class="label">Steps (limit 12)</span>
            <div class="meter"><i id="agSteps" style="width:0;background:repeating-linear-gradient(45deg,var(--sky) 0 10px,var(--grape) 10px 20px)"></i><span id="agStepsTxt">0 / 12</span></div>
          </div>
        </div>
        <div class="canvas" style="display:grid;gap:10px;min-width:0">
          <div class="row">
            <button class="btn pink" type="button" id="agBack">◀ Back</button>
            <button class="btn" type="button" id="agNext">Next step ▶</button>
            <button class="btn sky" type="button" id="agPlay">Auto-play</button>
            <button class="btn lemon small" type="button" id="agReset">Reset</button>
            <label class="toggle"><input type="checkbox" id="agSkip"> Skip the citator</label>
          </div>
          <div class="log" id="agLog" aria-live="polite"></div>
        </div>
      </div>
      <div class="why-list">
        <div class="why" style="background:var(--grape-l)"><b>Goal</b>A task, not a single question. "Research and draft" instead of "what is X."</div>
        <div class="why" style="background:var(--tang-l)"><b>Tools</b>Search, retrieval, citators, calculators, email. Described to the model in plain text plus a schema. Connector standards like MCP make tools plug-in.</div>
        <div class="why" style="background:var(--sky-l)"><b>Loop + stop rule</b>Keep going until done, out of steps, or blocked. Step limits keep a confused agent from running forever.</div>
        <div class="why" style="background:var(--lime-l)"><b>Guardrails</b>Ask a human before anything risky or irreversible (filing, sending, deleting). Log every tool call so the work is auditable.</div>
      </div>
      <div class="nerd">
        <div class="nerd-h"><svg viewBox="0 0 30 16" aria-hidden="true"><circle cx="7" cy="8" r="5.5" fill="#fff" stroke="#1a1033" stroke-width="2"/><circle cx="23" cy="8" r="5.5" fill="#fff" stroke="#1a1033" stroke-width="2"/><path d="M12.5 7h5" stroke="#1a1033" stroke-width="2"/></svg>NERD MODE · the math</div>
        <div class="nerd-b">
          <div class="eqs">
            <div class="eq"><span class="cap">Start state: everything the model sees on turn 0.</span><i>c</i><sub>0</sub> = system ⊕ tool schemas ⊕ task</div>
            <div class="eq"><span class="cap">The LLM is the policy: it samples an action (a thought, a tool call, or a final answer) token by token.</span><i>a</i><sub><i>k</i></sub> ∼ <i>π</i><sub><i>θ</i></sub>( · | <i>c</i><sub><i>k</i></sub>)</div>
            <div class="eq"><span class="cap">Ordinary code executes the call; the result becomes new input text.</span><i>o</i><sub><i>k</i></sub> = Env(<i>a</i><sub><i>k</i></sub>), &nbsp;&nbsp; <i>c</i><sub><i>k</i>+1</sub> = <i>c</i><sub><i>k</i></sub> ⊕ <i>a</i><sub><i>k</i></sub> ⊕ <i>o</i><sub><i>k</i></sub></div>
            <div class="eq"><span class="cap">Stop rule:</span>halt when &nbsp;<i>a</i><sub><i>k</i></sub> ∈ FINAL &nbsp;∨&nbsp; <i>k</i> = <i>K</i><sub>max</sub> &nbsp;∨&nbsp; |<i>c</i><sub><i>k</i></sub>| &gt; <i>n</i><sub>max</sub></div>
            <div class="live" id="liveAg"></div>
          </div>
          <div class="where">
            <span class="label">Where</span>
            <div><b>⊕</b><span>concatenation: appending text to the context</span></div>
            <div><b>c<sub>k</sub></b><span>the context (transcript) at loop step <i>k</i></span></div>
            <div><b>π<sub>θ</sub></b><span>the model viewed as a policy, the reinforcement-learning word for "decision rule"</span></div>
            <div><b>Env</b><span>the tools: search, citator, code runner…</span></div>
            <div><b>K<sub>max</sub></b><span>step limit (12 here)</span></div>
            <div><b>Note</b><span>no weights update during the run. The agent "learns" only by reading its own growing transcript.</span></div>
          </div>
        </div>
      </div>`,
  init(){
const AG_FULL=[
  {ph:'user',tag:'TASK',tok:180,body:'Research whether a no-contest clause bars a beneficiary who sues with probable cause. Write a short note. Cite and verify every source.'},
  {ph:'plan',tag:'PLAN · LLM thinks',tok:90,body:'I need the general rule, any exceptions, and verified authority. Start with the firm knowledge base.'},
  {ph:'act',tag:'ACT · tool call',tok:40,code:'kb_search({\n  "query": "no-contest clause probable cause exception",\n  "top_k": 3\n})'},
  {ph:'observe',tag:'OBSERVE · tool result',tok:420,code:'[M-101] No-contest clauses generally enforced; many\n        jurisdictions follow UPC § 3-905 (no penalty\n        if probable cause existed).\n[M-102] Some states allow a pre-filing petition\n        (safe harbor).'},
  {ph:'plan',tag:'PLAN · LLM thinks',tok:110,body:'The memos point to UPC § 3-905. A memo is secondary, so I should pull the primary source. I also recall a case that might support this: <i>Hartwell</i>. I\'ll verify it before using it.'},
  {ph:'act',tag:'ACT · tool call',tok:35,code:'legal_db_search({\n  "query": "Uniform Probate Code 3-905 penalty clause for contest"\n})'},
  {ph:'observe',tag:'OBSERVE · tool result',tok:380,code:'UPC § 3-905: a provision purporting to penalize an\ninterested person for contesting the will is\nunenforceable if probable cause exists.'},
  {ph:'act',tag:'ACT · tool call',tok:30,code:'citator_check({\n  "cite": "In re Estate of Hartwell, 287 S.W.3d 640"\n})',verify:true},
  {ph:'observe',tag:'OBSERVE · tool result',tok:25,code:'{ "status": "NOT FOUND",\n  "note": "No document matches this citation." }',verify:true},
  {ph:'plan',tag:'PLAN · LLM thinks',tok:70,body:'That case doesn\'t exist. My memory produced it. I\'ll drop it, rely only on what I retrieved, and flag that the state statute must be checked.',verify:true},
  {ph:'done',tag:'DONE · final answer',tok:260,body:'<b>Short answer:</b> Often no. Many jurisdictions, following UPC § 3-905, refuse to enforce a no-contest penalty against a beneficiary who had probable cause [UPC § 3-905; M-101]. Some states also let a beneficiary seek a pre-filing ruling [M-102]. <b>Next step:</b> confirm the governing state\'s statute; adoption of the UPC rule varies. <span class="stamp good">ALL SOURCES VERIFIED</span>'}
];
const AG_SKIP_DONE={ph:'done',tag:'DONE · final answer',tok:280,body:'<b>Short answer:</b> Often no. Many jurisdictions, following UPC § 3-905, refuse to enforce a no-contest penalty against a beneficiary who had probable cause [UPC § 3-905; M-101]. See also <i>In re Estate of Hartwell</i>, 287 S.W.3d 640 (Mo. App. 2009). <span class="stamp bad">FAKE CASE SLIPPED THROUGH</span><br><span class="tip">Same model, same task. The only difference is a skipped verification step, and a hallucinated citation reaches the final work product. The fix is a tool and a loop, not a smarter model.</span>'};
let agI=0, agPlayT=null;
function agSteps(){if(!$('#agSkip').checked)return AG_FULL;return AG_FULL.filter(s=>!s.verify&&s.ph!=='done').concat([AG_SKIP_DONE])}
const RING={plan:{a0:-90,a1:30,c:C.grape,l:'PLAN'},act:{a0:30,a1:150,c:C.tang,l:'ACT'},observe:{a0:150,a1:270,c:C.sky,l:'OBSERVE'}};
function arc(cx,cy,r1,r2,a0,a1){const R=a=>a*Math.PI/180;const p=(r,a)=>[cx+r*Math.cos(R(a)),cy+r*Math.sin(R(a))];const [x1,y1]=p(r2,a0+3),[x2,y2]=p(r2,a1-3),[x3,y3]=p(r1,a1-3),[x4,y4]=p(r1,a0+3);return `M${x1} ${y1} A${r2} ${r2} 0 0 1 ${x2} ${y2} L${x3} ${y3} A${r1} ${r1} 0 0 0 ${x4} ${y4}Z`}
function drawRing(ph){const svg=$('#ringSvg');svg.innerHTML='';
  for(const k in RING){const r=RING[k];el('path',{d:arc(130,130,62,118,r.a0,r.a1),fill:r.c,class:'ring-seg'+(ph===k?' on':'')},svg);
    const mid=(r.a0+r.a1)/2*Math.PI/180;const t=el('text',{x:130+90*Math.cos(mid),y:134+90*Math.sin(mid),'text-anchor':'middle',class:'ring-lbl',fill:'#fff'},svg);t.textContent=r.l}
  el('circle',{cx:130,cy:130,r:52,fill:ph==='done'?C.lime:ph==='user'?C.pinkL:C.paper,stroke:C.ink,'stroke-width':3},svg);
  const t=el('text',{x:130,y:126,'text-anchor':'middle',class:'ring-lbl'},svg);t.textContent=ph==='done'?'DONE!':ph==='user'?'TASK IN':'LLM';
  const t2=el('text',{x:130,y:146,'text-anchor':'middle','font-family':'Comic Neue, sans-serif','font-size':12,fill:C.ink},svg);t2.textContent=ph==='done'?'goal met':'in the loop'}
function drawAgent(){const S=agSteps();agI=Math.min(agI,S.length-1);if(S[agI]&&S[agI].verify&&S[agI].ph==='observe')award('citator');if(agI>=S.length-1)award('chef');const log=$('#agLog');log.innerHTML='';let tok=0;
  S.slice(0,agI+1).forEach((s,i)=>{tok+=s.tok;const e=document.createElement('div');e.className='entry '+s.ph+(i===agI?' current':'');
    e.innerHTML=`<span class="tag">${s.tag}</span>${s.body?`<div>${s.body}</div>`:''}${s.code?`<pre>${esc(s.code)}</pre>`:''}`;log.appendChild(e)});
  log.lastElementChild&&log.lastElementChild.scrollIntoView({block:'nearest',behavior:'smooth'});
  drawRing(S[agI].ph);
  const CTX=4000;$('#agCtx').style.width=Math.min(100,tok/CTX*100)+'%';$('#agCtxTxt').textContent=tok.toLocaleString()+' tokens (demo window: 4,000)';
  const loops=S.slice(1,agI+1).filter(s=>s.ph==='act').length;
  $('#agSteps').style.width=(loops/12*100)+'%';$('#agStepsTxt').textContent=loops+' tool calls / 12 max';
  $('#agBack').disabled=agI===0;$('#agNext').disabled=agI>=S.length-1;
  const cur=S[agI];
  $('#liveAg').innerHTML=`Now: k = <b>${loops}</b>, |c<sub>k</sub>| = <b>${tok.toLocaleString()}</b> tokens, current item: ${cur.ph==='plan'||cur.ph==='done'?'a<sub>k</sub> (model output)':cur.ph==='act'?'a<sub>k</sub> = tool call':cur.ph==='observe'?'o<sub>k</sub> = Env(a<sub>k</sub>) appended':'c<sub>0</sub>'} · stop? ${cur.ph==='done'?'<b>yes</b>, a<sub>k</sub> ∈ FINAL':'no'}`;
}
$('#agNext').onclick=()=>{agI++;blip(480+agI*30);drawAgent()};
$('#agBack').onclick=()=>{agI=Math.max(0,agI-1);blip(330);drawAgent()};
$('#agReset').onclick=()=>{clearInterval(agPlayT);agPlayT=null;$('#agPlay').textContent='Auto-play';agI=0;drawAgent()};
$('#agPlay').onclick=()=>{if(agPlayT){clearInterval(agPlayT);agPlayT=null;$('#agPlay').textContent='Auto-play';return}
  if(agI>=agSteps().length-1)agI=0;$('#agPlay').textContent='Pause';agPlayT=setInterval(()=>{if(agI>=agSteps().length-1){clearInterval(agPlayT);agPlayT=null;$('#agPlay').textContent='Auto-play';return}agI++;blip(480+agI*30);drawAgent()},1600)};
$('#agSkip').onchange=()=>{agI=Math.min(agI,agSteps().length-1);drawAgent();blip(220)};
agI=3;drawAgent();
  }};
