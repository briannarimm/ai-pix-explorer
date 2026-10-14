/* ==== TOY: Token Chopper (ported from v1) ==== */
TOYS.tokens={title:'Token Chopper',short:'Tokens',level:2,color:'var(--pink)',tb1:'var(--pink)',tb2:'var(--tang)',icon:ICONS.tokens,
  help:'Type anything. This chopper is a simplified stand-in for a real tokenizer.',
  html:`      <div class="canvas" style="display:grid;gap:12px">
        <label class="label" for="tokIn">Type or paste legal text</label>
        <textarea id="tokIn" rows="3">The trustee moved to dismiss under Rule 12(b)(6), arguing the beneficiary's no-contest claim was time-barred under § 456.4-420.</textarea>
        <div class="row">
          <button class="btn small lemon" type="button" data-sample="Plaintiff alleges breach of the implied covenant of good faith and fair dealing.">Contract claim</button>
          <button class="btn small lemon" type="button" data-sample="See Bell Atl. Corp. v. Twombly, 550 U.S. 544, 570 (2007).">A citation</button>
          <button class="btn small lemon" type="button" data-sample="The testator's holographic codicil was presumptively inadmissible.">Rare words</button>
          <span class="tip">Hover a token to see its ID.</span>
        </div>
        <div class="tok-out" id="tokOut" aria-live="polite"></div>
        <div><span class="label">What the model actually receives</span><div class="tok-ids" id="tokIds"></div></div>
        <div class="stats">
          <div class="stat"><b id="sChars">0</b><span>characters</span></div>
          <div class="stat"><b id="sWords">0</b><span>words</span></div>
          <div class="stat"><b id="sToks">0</b><span>tokens</span></div>
          <div class="stat"><b id="sRatio">0</b><span>characters per token</span></div>
        </div>
      </div>
      <div class="canvas" style="display:grid;gap:10px">
        <div class="row" style="justify-content:space-between">
          <span class="label">Context window: how much fits?</span>
          <div class="seg" id="ctxSeg">
            <button type="button" data-ctx="8000" aria-pressed="false">8K</button>
            <button type="button" data-ctx="200000" aria-pressed="true">200K</button>
            <button type="button" data-ctx="1000000" aria-pressed="false">1M</button>
          </div>
        </div>
        <label class="slider-row"><span>Pages of record</span><input type="range" id="pages" min="1" max="2000" value="300"><output id="pagesOut">300</output></label>
        <div class="meter"><i id="ctxBar" style="width:0"></i><span id="ctxTxt"></span></div>
        <p class="tip">Rough rule: one double-spaced page ≈ 300 words ≈ 400 tokens. When the record is bigger than the window, the model simply can't see the rest. That limit is one of the main reasons RAG exists.</p>
      </div>
      <div class="nerd">
        <div class="nerd-h"><svg viewBox="0 0 30 16" aria-hidden="true"><circle cx="7" cy="8" r="5.5" fill="#fff" stroke="#1a1033" stroke-width="2"/><circle cx="23" cy="8" r="5.5" fill="#fff" stroke="#1a1033" stroke-width="2"/><path d="M12.5 7h5" stroke="#1a1033" stroke-width="2"/></svg>NERD MODE · the math</div>
        <div class="nerd-b">
          <div class="eqs">
            <div class="eq"><span class="cap">Building the vocabulary (byte-pair encoding), repeated until |V| ≈ 100k–200k:</span>(<i>a</i>, <i>b</i>)<sup>*</sup> = argmax<sub>(<i>a</i>,<i>b</i>)</sub> count(<i>a</i> <i>b</i>) &nbsp;⟹&nbsp; <i>V</i> ← <i>V</i> ∪ {<i>ab</i>}</div>
            <div class="eq"><span class="cap">Encoding a string into a sequence of integer IDs:</span><b>x</b> = (<i>x</i><sub>1</sub>, <i>x</i><sub>2</sub>, …, <i>x</i><sub><i>n</i></sub>), &nbsp; <i>x</i><sub><i>i</i></sub> ∈ {0, 1, …, |<i>V</i>| − 1}</div>
            <div class="eq"><span class="cap">Why long contexts are expensive: every token is compared with every token.</span>cost(attention) ∝ <i>n</i><sup>2</sup> · <i>d</i> &nbsp;&nbsp; subject to &nbsp; <i>n</i> ≤ <i>n</i><sub>max</sub></div>
            <div class="live" id="liveTok"></div>
          </div>
          <div class="where">
            <span class="label">Where</span>
            <div><b>V</b><span>the vocabulary: every token the model knows</span></div>
            <div><b>count(a b)</b><span>how often token <i>a</i> is immediately followed by <i>b</i> in the training text</span></div>
            <div><b>n</b><span>number of tokens in the context</span></div>
            <div><b>n<sub>max</sub></b><span>the context window</span></div>
            <div><b>d</b><span>model width: length of each token's vector (thousands)</span></div>
          </div>
        </div>
      </div>
      <p class="tip">This chopper is a simplified stand-in written for this page. Real tokenizers (each model family has its own) split differently, but the behaviour is the same: frequent strings are cheap, rare ones get shredded.</p>`,
  init(){
const WHOLE=new Set('the a an to of and or in on for was is are be by as at it its that this with from under not no who had has have his her their our we you i court held trust trustee motion moved dismiss rule claim because state law case filed judge will clause contract party plaintiff defendant appeal order legal file time see corp v u s good faith fair dealing breach implied covenant was alleges notice estate claim'.split(' '));
const PIECES=['ization','ation','tion','sion','ment','ness','able','ible','ious','ence','ance','ity','ing','ary','ery','ism','ful','less','ive','ize','ous','ed','er','ly','es','al','ic','un','re','pre','dis','non','over','sub','inter','contest','benefic','iar','argu','barr','plain','tiff','fend','test','ator','holo','graph','cod','icil','pre','sum','pt','adm','iss','con','tract','neg','lig','tw','omb','atl','bell','miss','prob','ate','stat','ute','lim','ter','den','ant','ent','ust','ee','tr'];
PIECES.sort((a,b)=>b.length-a.length);
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0)%100256}
function splitWord(w){
  const lw=w.toLowerCase();
  if(WHOLE.has(lw)&&lw.length<=12)return [w];
  const out=[];let i=0;
  while(i<w.length){
    let m=null;
    for(const p of PIECES){if(p.length>=2&&lw.startsWith(p,i)){m=p;break}}
    const len=m?m.length:Math.min(3,w.length-i);
    out.push(w.slice(i,i+len));i+=len;
  }
  return out;
}
function tokenize(text){
  const re=/(\s*)([A-Za-z]+|\d{1,3}|[^\sA-Za-z\d])/g;const toks=[];let m;
  while((m=re.exec(text))){
    const sp=m[1].length?' ':'';const body=m[2];
    if(/^[A-Za-z]+$/.test(body)){splitWord(body).forEach((p,k)=>toks.push((k===0?sp:'')+p))}
    else toks.push(sp+body);
  }
  return toks;
}
const TCOL=[C.pinkL,C.lemonL,C.limeL,C.skyL,C.grapeL,C.tangL];
let ctxSize=200000;
function renderTok(){
  const txt=$('#tokIn').value;const toks=tokenize(txt);
  const out=$('#tokOut');out.innerHTML='';
  toks.forEach((t,i)=>{
    const s=document.createElement('span');s.className='tok';s.style.background=TCOL[i%TCOL.length];
    const id=hash(t);s.title='token ID '+id;s.dataset.hint='Token "'+t.trim()+'"'+(t.startsWith(' ')?' (with its leading space)':'')+' → ID '+id;
    s.innerHTML=t.startsWith(' ')?'<span class="sp">·</span>'+esc(t.slice(1)):esc(t);
    out.appendChild(s);
  });
  $('#tokIds').textContent='['+toks.map(hash).join(', ')+']';
  const words=(txt.trim().match(/\S+/g)||[]).length;
  $('#sChars').textContent=txt.length;$('#sWords').textContent=words;$('#sToks').textContent=toks.length;
  $('#sRatio').textContent=toks.length?(txt.length/toks.length).toFixed(1):'0';
  const n=toks.length;
  $('#liveTok').innerHTML=`Your text: <b>n = ${n}</b> tokens → n² = <b>${(n*n).toLocaleString()}</b> attention scores per head, per layer. With 64 heads × 80 layers that's ${(n*n*64*80).toLocaleString()} scores for one forward pass.`;
}
function renderCtx(){
  const pages=+$('#pages').value;$('#pagesOut').value=pages;$('#pagesOut').textContent=pages;
  const need=pages*400;const pct=Math.min(100,need/ctxSize*100);
  $('#ctxBar').style.width=pct+'%';
  $('#ctxTxt').textContent=need>ctxSize?`${need.toLocaleString()} tokens: doesn't fit! Only ~${Math.floor(ctxSize/400).toLocaleString()} pages visible`:`${need.toLocaleString()} of ${ctxSize.toLocaleString()} tokens (${pct.toFixed(0)}%)`;
}
$('#tokIn').addEventListener('input',renderTok);
$$('[data-sample]').forEach(b=>b.onclick=()=>{$('#tokIn').value=b.dataset.sample;renderTok();blip(700)});
$$('#ctxSeg button').forEach(b=>b.onclick=()=>{ctxSize=+b.dataset.ctx;$$('#ctxSeg button').forEach(x=>x.setAttribute('aria-pressed',x===b));renderCtx();blip(600)});
$('#pages').addEventListener('input',renderCtx);
renderTok();renderCtx();
$('#pages').addEventListener('input',()=>{if(+$('#pages').value*400>ctxSize)award('desk')});
$('#ctxSeg').addEventListener('click',()=>{if(+$('#pages').value*400>ctxSize)award('desk')});
$$('[data-sample]').forEach(b=>b.addEventListener('click',()=>award('tokens')));
$('#tokIn').addEventListener('input',()=>award('tokens'));
  }};
