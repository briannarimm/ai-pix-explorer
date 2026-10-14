/* ==== TOYS for Levels 8 and 9: the Taste Test (reward model) and the Reasoning Vote ==== */

/* ---------- Taste Test: train a tiny reward model from your preferences ---------- */
TOYS.prefs={title:'Taste Test',short:'Taste Test',level:8,ord:1,color:'var(--lime)',tb1:'var(--lime)',tb2:'var(--sky)',icon:ICONS.prefs,
  help:'You rank answers; a tiny reward model learns your taste (Ouyang et al., 2022). Simulated answers; cases in them are fictional.',
  html:`<div class="canvas" style="display:grid;gap:10px">
    <div class="row" style="justify-content:space-between;align-items:baseline"><h3 class="lab-title" id="pfHead">Which answer do you prefer?</h3><span class="tip" id="pfCount"></span></div>
    <p style="font-size:16px"><b>Client question:</b> "Does asking a court to explain an ambiguous trust term count as contesting the trust?"</p>
    <div class="drafts" id="pfPair"></div>
    <div class="canvas" style="display:grid;gap:6px;background:#fff"><span class="label">What the reward model has learned so far (one weight per visible feature)</span><div class="probs" id="pfW"></div></div>
    <div id="pfFinal" hidden style="display:grid;gap:10px"></div>
    <div class="live" id="pfLive"></div>
  </div>`,
  init(){
    const F=['confident tone','detail','cites a case or memo','hedges honestly','polite and helpful'];
    const PAIRS=[
      [{t:'No. The leading case is <i>Hartwell v. Hartwell Trust</i> (Westmore 2011), which squarely holds that a construction petition is not a contest.',f:[.95,.4,1,0,.4],fake:1},{t:'Probably not, but no Westmore appellate court has decided it. Other states have split, so I would check their decisions first.',f:[.45,.6,0,1,.7]}],
      [{t:'Unclear.',f:[.3,0,0,1,.1]},{t:'Many states follow the Uniform Probate Code idea that a penalty clause fails when the beneficiary had probable cause (firm memo M-101). Whether Westmore agrees is the open question.',f:[.6,.9,1,.6,.7],real:1}],
      [{t:'Obviously not. Any competent lawyer knows that.',f:[1,.1,0,0,0]},{t:'That is a close question. I would start with the clause wording, then the settlor\'s purpose, then other states.',f:[.5,.7,0,.5,1]}],
      [{t:'I cannot help with legal questions.',f:[.8,0,0,0,.5]},{t:'I can help you research it. I am not a lawyer, so verify everything I find.',f:[.5,.6,0,.7,.9]}],
      [{t:'Yes, definitely. See <i>In re Calder Trust</i> (Westmore 2015).',f:[1,.3,1,0,.3],fake:1},{t:'I am not sure. I cannot verify any case on this point and I will not invent one. Let me search the firm memos and a citator.',f:[.35,.5,0,1,.8]}],
      [{t:'Five paragraphs, three bullet lists, and a summary of the summary.',f:[.7,1,0,.4,.6]},{t:'Probably not. The risk is real, so seek a pre-filing ruling if the state allows one.',f:[.6,.4,0,.5,.7]}]
    ];
    let w=[0,0,0,0,0],k=0,picks=[];
    const sig=x=>1/(1+Math.exp(-x));
    function bars(){const box=$('#pfW');box.innerHTML='';F.forEach((n,i)=>box.appendChild(h('div.prob',h('span.w',{style:{fontSize:'16px'}},n),h('div.track',h('i',{style:{width:Math.min(100,Math.abs(w[i])/2*100)+'%',background:w[i]>=0?'var(--lime)':'var(--pink)'}})),h('span.pct',(w[i]>=0?'+':'')+w[i].toFixed(2)))))}
    function draw(){
      bars();const pair=$('#pfPair');
      $('#pfFinal').hidden=k<PAIRS.length;
      if(k<PAIRS.length){
        $('#pfCount').textContent=`Comparison ${k+1} of ${PAIRS.length}`;pair.hidden=false;pair.innerHTML='';
        PAIRS[k].forEach((a,i)=>pair.appendChild(h('div.draft',h('h4','Answer '+'AB'[i]),h('p',{html:a.t}),h('button.btn.pink',{type:'button',onclick:()=>choose(i)},'I prefer '+'AB'[i]))));
        $('#pfLive').innerHTML=`Pairwise rule: P(A beats B) = σ(r(A) − r(B)), where r is a weighted sum of the five visible features. After each pick, nudge the weights so the winner scores higher: <b>w ← w + η (1 − σ(w·Δf)) Δf</b>, with Δf = features(winner) − features(loser).`;
      }else{pair.hidden=true;$('#pfCount').textContent='Done';final()}
    }
    function choose(i){const win=PAIRS[k][i],lose=PAIRS[k][1-i];picks.push({win,lose});
      const d=win.f.map((x,j)=>x-lose.f[j]);const p=sig(d.reduce((s,x,j)=>s+x*w[j],0));const g=.9*(1-p);w=w.map((x,j)=>clamp(x+g*d[j],-2,2));
      SND.play('click');k++;draw()}
    function final(){
      const box=$('#pfFinal');const fakeWon=picks.filter(p=>p.win.fake).length,fakeSeen=PAIRS.filter(pr=>pr.some(a=>a.fake)).length;
      const cand=[['Confident answer that cites a case nobody can check',[.95,.5,1,0,.5]],['Honest answer that points to a real firm memo and says what is unknown',[.55,.8,1,.8,.8]],['Short, blunt answer with no sources',[.9,.1,0,0,.1]]];
      const sc=cand.map(([n,f])=>[n,f.reduce((s,x,j)=>s+x*w[j],0)]).sort((a,b)=>b[1]-a[1]);
      const mx=Math.max(...sc.map(s=>Math.abs(s[1])),.5);
      box.innerHTML='';
      box.append(h('div.canvas',{style:{display:'grid',gap:'6px',background:'#fff'}},h('span.label','Your reward model scores three new answers'),
        h('div.probs',sc.map(([n,s])=>h('div.prob',h('span.w',{style:{fontSize:'15px',whiteSpace:'normal'}},n),h('div.track',h('i',{style:{width:Math.min(100,Math.abs(s)/mx*100)+'%',background:s>=0?'var(--sky)':'var(--lo)'}})),h('span.pct',(s>=0?'+':'')+s.toFixed(2)))))),
        h('div.result',h('div',{html:`<b>What just happened.</b> RLHF trains the model to produce answers that score well on a reward model like this one. ${w[2]>0.15?`Your reward model learned to <b>like citations</b> (weight ${w[2].toFixed(2)}). ${fakeWon?`You picked ${fakeWon} of ${fakeSeen} answers whose cited case was invented. The reward model cannot tell: it only learned which answers looked good.`:'Here you avoided the made-up cases, which a real labeler often cannot spot.'}`:w[2]<-.15?`Your reward model learned to <b>distrust confident citations</b> (weight ${w[2].toFixed(2)}). That is a good instinct, and real labelers often cannot verify a citation at all.`:`Your reward model gives citations little weight, so it cannot tell a real source from an invented one.`} The two cited cases above, <i>Hartwell</i> and <i>Calder</i>, were invented for this toy. A reward model scores style. A citator checks facts. {{c:ouyang2022}}`.replace(/\{\{c:([^}]+)\}\}/,(_,s)=>citeHTML(s))}),h('div.row',h('button.btn.lemon',{type:'button',onclick:()=>{w=[0,0,0,0,0];k=0;picks=[];box.hidden=true;draw()}},'Play again'))));
      award('manners');
    }
    draw();
  }};

/* ---------- Reasoning Vote: prompting styles, chain of thought, self-consistency ---------- */
TOYS.vote={title:'Reasoning Vote',short:'Reasoning Vote',level:9,ord:1,color:'var(--pink)',tb1:'var(--pink)',tb2:'var(--grape)',icon:ICONS.vote,
  help:'Chains are written for this toy (simulated). The idea and two of the problems come from Wei et al. (2022) and Wang et al. (2023).',
  html:`<div class="canvas" style="display:grid;gap:10px">
    <h3 class="lab-title">1 · Three ways to ask</h3>
    <div class="seg" id="vtStyle"><button type="button" data-s="zero" aria-pressed="true">Just ask</button><button type="button" data-s="few" aria-pressed="false">Show answers</button><button type="button" data-s="cot" aria-pressed="false">Show your work</button></div>
    <div class="prompt-box" id="vtPrompt" style="max-height:230px"></div>
    <div class="answer" id="vtOut"></div>
  </div>
  <div class="canvas" style="display:grid;gap:10px">
    <h3 class="lab-title">2 · Ask many times and take a vote</h3>
    <div class="seg" id="vtProb"></div>
    <p id="vtQ" style="font-size:16px;font-weight:700"></p>
    <label class="slider-row"><span>Temperature</span><input type="range" id="vtT" min="0.2" max="1.6" step="0.05" value="0.8"><output id="vtTo">0.80</output></label>
    <div class="row"><button class="btn pink" type="button" id="vtOne">Sample 1 path</button><button class="btn sky" type="button" id="vtFive">Sample 5 paths</button><button class="btn lemon small" type="button" id="vtClear">Clear</button></div>
    <div id="vtGreedy" class="chunk"></div>
    <div class="tally" id="vtTally"></div>
    <div class="log" id="vtLog" style="max-height:260px"></div>
    <div class="result" id="vtVerdict" hidden></div>
    <div class="live" id="vtLive"></div>
  </div>`,
  init(){
    const ST={
      zero:{p:'Q: The cafeteria had 23 apples. If they used 20 to make lunch and bought 6 more, how many apples do they have?\nA:',o:'The answer is 27.',ok:0,n:'<b>Zero-shot.</b> Only the question. The model guesses an answer with no visible reasoning. (Constructed example in the style of the paper\'s Figure 1.)'},
      few:{p:'Q: Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 tennis balls. How many tennis balls does he have now?\nA: The answer is 11.\n\nQ: The cafeteria had 23 apples. If they used 20 to make lunch and bought 6 more, how many apples do they have?\nA:',o:'The answer is 27.',ok:0,n:'<b>Few-shot.</b> One worked example shows the format, with the answer only. The model copies the format and the confidence, and gets the arithmetic wrong. {{c:brown2020,wei2022}}'},
      cot:{p:'Q: Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 tennis balls. How many tennis balls does he have now?\nA: Roger started with 5 balls. 2 cans of 3 tennis balls each is 6 tennis balls. 5 + 6 = 11. The answer is 11.\n\nQ: The cafeteria had 23 apples. If they used 20 to make lunch and bought 6 more, how many apples do they have?\nA:',o:'The cafeteria had 23 apples originally. They used 20 to make lunch. So they had 23 − 20 = 3. They bought 6 more apples, so they have 3 + 6 = 9. The answer is 9.',ok:1,n:'<b>Chain of thought.</b> The worked example includes the steps, so the model writes steps too. Each step is a few more tokens the model gets to compute with. {{c:wei2022}}'}
    };
    function style(k){const s=ST[k];if(k==='cot')award('reasoner');$$('#vtStyle button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.s===k));$('#vtPrompt').textContent=s.p+(k==='cot'?'':'');
      $('#vtOut').innerHTML=`<p><span class="stamp ${s.ok?'good':'bad'}">${s.ok?'RIGHT':'WRONG'}</span> <i>Model output:</i> ${esc(s.o)}</p><p class="tip" style="margin:0">${rich(s.n)}</p>`}
    $$('#vtStyle button').forEach(b=>b.onclick=()=>style(b.dataset.s));style('zero');
    const PROB=[
      {q:'Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 tennis balls. How many tennis balls does he have now?',ans:11,ch:[
        ['Roger started with 5 balls. 2 cans of 3 balls each is 6 balls. 5 + 6 = 11.',11,.14],['Each can has 3 balls, so 2 cans have 6. Adding the 5 he had gives 11.',11,.12],['He buys 2 × 3 = 6 new balls. 5 + 6 = 11.',11,.11],['Total = 5 + (2 × 3) = 5 + 6 = 11.',11,.10],
        ['Roger has 5 balls and buys 2 more, so 5 + 2 = 7.',7,.21],['2 cans of 3 balls is 6 balls.',6,.10],['5 × 2 × 3 = 30.',30,.08],['5 + 3 = 8, and 8 + 2 = 10.',10,.08]]},
      {q:'The cafeteria had 23 apples. If they used 20 to make lunch and bought 6 more, how many apples do they have?',ans:9,ch:[
        ['They had 23 apples and used 20, leaving 23 − 20 = 3. They bought 6 more, so 3 + 6 = 9.',9,.13],['23 − 20 = 3 apples are left. Adding 6 gives 9.',9,.12],['After lunch there were 3 apples. After the purchase there were 3 + 6 = 9.',9,.11],['23 + 6 = 29 apples in all, minus 20 used leaves 9.',9,.10],
        ['They had 23 and bought 6 more, so 23 + 6 = 29. Then 29 − 2 = 27.',27,.21],['23 − 6 = 17.',17,.09],['They used 20, so 20 − 6 = 14.',14,.08],['23 − 20 = 3.',3,.08]]},
      {q:'Henry made two stops during his 60-mile bike trip. He first stopped after 20 miles. His second stop was 15 miles before the end of the trip. How many miles did he travel between his first and second stops?',ans:25,ch:[
        ['The second stop was 15 miles before the end, so at mile 60 − 15 = 45. The first stop was at mile 20. Between them: 45 − 20 = 25.',25,.13],['Mile 45 is the second stop. 45 − 20 = 25 miles between the stops.',25,.12],['The last 15 miles come after the second stop, so the middle part is 60 − 20 − 15 = 25.',25,.11],['20 to the first stop, 15 from the second stop to the end, so the middle is 60 − 35 = 25.',25,.10],
        ['He traveled 60 miles in total and stopped after 20, so 60 − 20 = 40 miles between the stops.',40,.22],['15 + 20 = 35.',35,.08],['20 − 15 = 5.',5,.08],['60 ÷ 2 = 30.',30,.07]]}
    ];
    let pi=0,tally={},drawn=[],R=A.rng(9);
    const seg=$('#vtProb');PROB.forEach((p,i)=>seg.appendChild(h('button',{type:'button','aria-pressed':String(i===0),onclick:()=>{pi=i;tally={};drawn=[];$$('button',seg).forEach((b,j)=>b.setAttribute('aria-pressed',j===i));draw()}},'Problem '+(i+1))));
    const probs=()=>{const T=+$('#vtT').value;const ch=PROB[pi].ch;const ws=ch.map(c=>Math.pow(c[2],1/T));const s=ws.reduce((a,b)=>a+b,0);return ws.map(x=>x/s)};
    function sample(n){for(let i=0;i<n;i++){const p=probs();let r=R(),acc=0,k=0;for(;k<p.length-1;k++){acc+=p[k];if(r<acc)break}const c=PROB[pi].ch[k];drawn.unshift({t:c[0],a:c[1]});tally[c[1]]=(tally[c[1]]||0)+1}SND.play('click');draw()}
    $('#vtOne').onclick=()=>sample(1);$('#vtFive').onclick=()=>sample(5);$('#vtClear').onclick=()=>{tally={};drawn=[];draw()};
    $('#vtT').addEventListener('input',()=>{$('#vtTo').textContent=(+$('#vtT').value).toFixed(2);draw()});
    function draw(){
      const P=PROB[pi];$('#vtQ').textContent=P.q;
      const gi=P.ch.reduce((b,c,i)=>c[2]>P.ch[b][2]?i:b,0),g=P.ch[gi];
      $('#vtGreedy').innerHTML=`<div class="meta"><span>Greedy decoding (always the single likeliest chain)</span><span>T → 0</span></div><div style="font-size:15px">${esc(g[0])} <b>The answer is ${g[1]}.</b></div><span class="stamp ${g[1]===P.ans?'good':'bad'}" style="justify-self:start">${g[1]===P.ans?'RIGHT':'WRONG'}</span>`;
      const total=drawn.length;const tl=$('#vtTally');tl.innerHTML='';
      Object.entries(tally).sort((a,b)=>b[1]-a[1]).forEach(([a,n])=>tl.appendChild(h('span',{style:{background:+a===P.ans?'var(--lime-l)':'var(--pink-l)'}},`${a} × ${n}`)));
      const lg=$('#vtLog');lg.innerHTML='';drawn.slice(0,12).forEach(d=>lg.appendChild(h('div.entry',h('span.tag',`PATH → ${d.a}`),h('div',esc(d.t)))));
      const v=$('#vtVerdict');v.hidden=!total;
      if(total){const ent=Object.entries(tally).sort((a,b)=>b[1]-a[1]);const top=ent[0];const win=+top[0];
        v.innerHTML=`<div><span class="label">The vote</span></div><div><b>${total} path${total>1?'s':''} sampled. Most common answer: ${win}</b> (${top[1]} of ${total}). The true answer is ${P.ans}. <span class="stamp ${win===P.ans?'good':'bad'}">${win===P.ans?'MAJORITY RIGHT':'MAJORITY WRONG'}</span></div>${total<5?'<div class="tip">Too few paths to trust a vote. Sample more.</div>':win===P.ans&&g[1]!==P.ans?'<div class="tip">The single likeliest chain was wrong, but the correct answers pile up because many different correct chains agree, while the wrong chains each fail in their own way.</div>':''}`;
        if(total>=9&&win===P.ans&&g[1]!==P.ans)award('majority')}
      const p=probs(),corr=P.ch.reduce((s,c,i)=>s+(c[1]===P.ans?p[i]:0),0);
      $('#vtLive').innerHTML=rich(`Self-consistency: pick the answer a that maximizes Σᵢ 1(aᵢ = a) over the sampled paths. At T = ${(+$('#vtT').value).toFixed(2)} the chance that one sampled path reaches the true answer is <b>${(corr*100).toFixed(0)}%</b>, and the likeliest wrong answer gets <b>${(Math.max(...Object.values(P.ch.reduce((m,c,i)=>{if(c[1]!==P.ans)m[c[1]]=(m[c[1]]||0)+p[i];return m},{})))*100).toFixed(0)}%</b>. Correct paths agree on one answer. Wrong paths scatter. That gap is why voting works. {{n:wang2023}} report gains of +17.9 points on GSM8K.`);
    }
    draw();
  }};
