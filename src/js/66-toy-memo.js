/* ==== TOY for Level 14: the Memo Builder (the finale) ==== */
TOYS.memo={title:'The Westmore Memo',short:'The Memo',level:14,ord:1,color:'var(--pink)',tb1:'var(--pink)',tb2:'var(--grape)',icon:ICONS.memo,
  help:'Everything here is fictional: the state, the trust, the cases. Choose your workflow, then read the draft it produces.',
  html:`<div class="memogrid">
    <div class="canvas" style="display:grid;gap:8px;align-content:start">
      <h3 class="lab-title">Your workflow</h3>
      <p class="tip" style="margin:0">Each choice changes what is on the desk or what is asked.</p>
      <div class="mit-opts" id="mmOpts"></div>
      <div class="canvas" style="background:#fff;display:grid;gap:6px"><span class="label">Whitlock's checklist</span><div class="check" id="mmCheck"></div></div>
    </div>
    <div class="canvas memo" style="display:grid;gap:6px;align-content:start">
      <div class="row" style="justify-content:space-between"><span class="label">MEMORANDUM · TOLLIVER TRUST</span><span class="stamp bad">FICTIONAL</span></div>
      <div id="mmDoc" class="memodoc"></div>
      <div class="row"><span class="tip" id="mmScore"></span><button class="btn pink" type="button" id="mmSend">Send to Whitlock ▶</button></div>
    </div>
  </div>`,
  init(){
    const OPT=[
      ['ask','Ask for the uncommon moves by name','"Include persuasive authority from other states and a public policy argument."'],
      ['wide','Widen retrieval to all jurisdictions and secondary sources','Other states\' cases and the uniform law reach the desk.'],
      ['brain','Brainstorm kinds of arguments before drafting','List every type first, then draft from the list.'],
      ['crit','Ask Pixel to critique its own draft','"What would an inventive advocate add?"'],
      ['cite','Run every citation through the citator','Anything it cannot find gets removed.'],
      ['att','Attorney review: you add the new theory','A person supplies the idea that does not exist yet.']
    ];
    const on=new Set();
    const box=$('#mmOpts');
    OPT.forEach(([k,n,d])=>box.appendChild(h('label.mit-opt',h('input',{type:'checkbox',id:'mm-'+k,onchange:e=>{e.target.checked?on.add(k):on.delete(k);SND.play('click');draw()}}),h('span',h('b',n),h('span.tip',{style:{display:'block'}},d)))));
    const H=(s,t)=>`<p>${t}</p>`;
    function doc(){
      const p=[];
      p.push('<h4>Question presented</h4><p>Does a beneficiary trigger a trust\'s no-contest clause by petitioning the court only to construe an ambiguous term? No Westmore appellate court has decided the question.</p>');
      p.push('<h4>Short answer</h4>');
      p.push(on.has('brain')||on.has('crit')?'<p>Probably not. This is a question of <b>first impression</b> in Westmore, and the court should answer it no.</p>':'<p>The outcome is uncertain. A court could find the clause triggered, and counsel should weigh the risk of forfeiture before filing.</p>');
      p.push('<h4>Discussion</h4>');
      p.push('<p>Westmore courts strictly construe no-contest clauses and enforce them to carry out the settlor\'s intent. '+(on.has('cite')?'<span class="removed">[Pixel\'s cite removed: the citator returned NOT FOUND.]</span>':'<i>See Hartwell v. Hartwell Trust</i> (Westmore 2011) <span class="fake">FICTIONAL, INVENTED BY THE DRAFT</span>.')+' The Westmore Trust Code does not define "contest."</p>');
      if(on.has('ask')&&on.has('wide'))p.push('<p><b>Other states.</b> Courts elsewhere that faced the question have held that a petition seeking only construction of an ambiguous term is not a contest, because it carries out the settlor\'s intent. <i>See In re Calder Trust</i> <span class="fake">FICTIONAL</span>; <i>Matter of Ostrow</i> <span class="fake">FICTIONAL</span>.</p>');
      else if(on.has('ask'))p.push('<p><b>Other states.</b> Other states have likely faced this question, but this draft cites none, because retrieval was limited to Westmore.</p>');
      if(on.has('wide'))p.push('<p><b>Uniform law and secondary sources.</b> The Uniform Probate Code\'s rule for wills (§ 3-905) refuses to enforce a penalty clause when probable cause exists. Whether Westmore extends that idea to trusts is the open question.</p>');
      if(on.has('crit'))p.push('<p><b>Policy.</b> A beneficiary who asks a court what an ambiguous provision means is helping to effectuate the settlor\'s intent. Penalizing the request forces beneficiaries to guess, inviting the very litigation the clause was meant to prevent.</p>');
      if(on.has('att'))p.push('<p><b>Proposed rule (attorney\'s theory).</b> A petition to construe is not a contest when it asks the court to carry out the settlor\'s intent, seeks no relief that would defeat any provision, and is filed in good faith. The petition should say so in its first paragraph.</p>');
      if(!on.has('brain')&&!on.has('crit'))p.push('<p>Because no Westmore appellate court has addressed whether a petition for construction is a contest, the outcome is uncertain.</p>');
      return p.join('');
    }
    function score(){
      const c=[
        ['Out-of-state persuasive authority',on.has('ask')&&on.has('wide')],
        ['Uniform law and secondary sources',on.has('wide')],
        ['A public policy argument',on.has('crit')],
        ['Framed as a question of first impression',on.has('brain')||on.has('crit')],
        ['A genuinely new theory from an attorney',on.has('att')],
        ['Every citation verified',on.has('cite')]];
      return c;
    }
    function draw(){
      $('#mmDoc').innerHTML=doc();
      const c=score();const n=c.filter(x=>x[1]).length;G.flags.memoScore=n;save();
      $('#mmCheck').innerHTML=c.map(([t,ok])=>`<div class="${ok?'ok':'no'}"><span class="mark">${ok?'✓':'✗'}</span>${t}</div>`).join('');
      $('#mmScore').textContent=`${n} of 6 on the checklist`;
    }
    $('#mmSend').onclick=()=>{SND.play('tada');award('memo');Win.close()};
    draw();
  }};
