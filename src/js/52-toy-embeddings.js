/* ==== TOY: Meaning Map (ported from v1) ==== */
TOYS.embeddings={title:'Meaning Map',short:'Meaning Map',level:3,color:'var(--lime)',tb1:'var(--lime)',tb2:'var(--sky)',icon:ICONS.embeddings,
  help:'A 2-D picture of legal terms. Real embeddings have thousands of dimensions.',
  html:`      <div class="two">
        <div class="canvas" style="display:grid;gap:10px">
          <div class="row" style="justify-content:space-between">
            <label class="toggle"><input type="checkbox" id="embColor" checked> Color by cluster</label>
            <span class="tip">Click any dot.</span>
          </div>
          <svg class="emb-svg" id="embSvg" viewBox="0 0 640 460" role="img" aria-label="2D map of legal term embeddings"></svg>
          <div class="legend" id="embLegend"></div>
        </div>
        <div style="display:grid;gap:14px;align-content:start;min-width:0">
          <div class="canvas" style="display:grid;gap:8px">
            <span class="label">Nearest neighbours</span>
            <p id="nnHead" class="tip">Pick a dot to see what's closest.</p>
            <div class="nn-list" id="nnList"></div>
          </div>
          <div class="canvas" style="display:grid;gap:8px">
            <label class="label" for="embQ">Drop a question onto the map</label>
            <input type="text" id="embQ" value="my client's mother changed her will and left her out">
            <button class="btn sky" type="button" id="embGo">Place it ★</button>
            <p class="tip" id="embQNote">The star lands near the concepts the question is about, even with no exact word overlap. That's semantic search.</p>
          </div>
          <div class="sticky-note">
            <h3>Spot the two "wills"</h3>
            <p>"Will" the testament and "will" as in "I will go" are the same spelling with different meanings. Modern models give each occurrence a <i>contextual</i> embedding, so after a few layers they drift apart. Same for "consideration."</p>
          </div>
        </div>
      </div>
      <div class="nerd">
        <div class="nerd-h"><svg viewBox="0 0 30 16" aria-hidden="true"><circle cx="7" cy="8" r="5.5" fill="#fff" stroke="#1a1033" stroke-width="2"/><circle cx="23" cy="8" r="5.5" fill="#fff" stroke="#1a1033" stroke-width="2"/><path d="M12.5 7h5" stroke="#1a1033" stroke-width="2"/></svg>NERD MODE · the math</div>
        <div class="nerd-b">
          <div class="eqs">
            <div class="eq"><span class="cap">Lookup: each token ID selects one row of a learned matrix.</span><b>e</b><sub><i>i</i></sub> = <i>W</i><sub><i>E</i></sub>[<i>x</i><sub><i>i</i></sub>], &nbsp;&nbsp; <i>W</i><sub><i>E</i></sub> ∈ ℝ<sup>|<i>V</i>| × <i>d</i></sup></div>
            <div class="eq"><span class="cap">Add word order (many current models instead rotate queries and keys by an angle <i>iθ</i>, called RoPE):</span><b>h</b><sub><i>i</i></sub><sup>(0)</sup> = <b>e</b><sub><i>i</i></sub> + PE(<i>i</i>)</div>
            <div class="eq"><span class="cap">Cosine similarity, the usual closeness score:</span>cos(<b>u</b>, <b>v</b>) = <span class="frac"><span><b>u</b> · <b>v</b></span><span>‖<b>u</b>‖ ‖<b>v</b>‖</span></span> = <span class="frac"><span><span class="big">Σ</span><sub><i>k</i></sub> <i>u</i><sub><i>k</i></sub><i>v</i><sub><i>k</i></sub></span><span>√<span style="text-decoration:overline">Σ <i>u</i><sub><i>k</i></sub><sup>2</sup></span> √<span style="text-decoration:overline">Σ <i>v</i><sub><i>k</i></sub><sup>2</sup></span></span></span></div>
            <div class="eq"><span class="cap">How search embeddings are trained (contrastive loss): pull a query toward its matching passage <i>d</i><sup>+</sup>, push it from the rest.</span>ℒ = −log <span class="frac"><span>exp(cos(<b>q</b>, <b>d</b><sup>+</sup>) / <i>τ</i>)</span><span><span class="big">Σ</span><sub><i>d</i></sub> exp(cos(<b>q</b>, <b>d</b>) / <i>τ</i>)</span></span></div>
            <div class="live" id="liveEmb"></div>
          </div>
          <div class="where">
            <span class="label">Where</span>
            <div><b>W<sub>E</sub></b><span>the embedding table, one row per vocabulary token, learned by gradient descent</span></div>
            <div><b>d</b><span>embedding size, typically 2,048–16,384</span></div>
            <div><b>PE(i)</b><span>positional encoding for slot <i>i</i>, so the model knows word order</span></div>
            <div><b>τ</b><span>temperature of the contrastive loss (sharpness)</span></div>
            <div><b>2-D map</b><span>this picture uses plain distance on a 2-D projection; the bars show 1 − distance / 90</span></div>
          </div>
        </div>
      </div>`,
  init(){
const CL={con:{n:'Contracts',c:C.pink},tor:{n:'Torts',c:C.tang},cri:{n:'Criminal',c:C.sky},pro:{n:'Property',c:C.lime},tru:{n:'Trusts & estates',c:C.grape},civ:{n:'Procedure',c:C.lemon},odd:{n:'Everyday meaning',c:'#ffffff'}};
const TERMS=[
  ['offer',14,18,'con','offer accept bargain'],['acceptance',25,13,'con','accept agreement'],['consideration',29,27,'con','bargain exchange contract'],['breach of contract',16,30,'con','breach contract broke deal promise'],['expectation damages',28,37,'con','damages contract benefit bargain'],
  ['damages',50,20,'con','damages money compensation injury'],
  ['negligence',70,17,'tor','negligence careless accident injury'],['duty of care',82,14,'tor','duty care'],['proximate cause',80,28,'tor','cause causation'],['strict liability',67,30,'tor','liability product dangerous'],
  ['mens rea',72,70,'cri','intent guilty mind crime'],['actus reus',84,66,'cri','act crime'],['indictment',87,79,'cri','charge grand jury crime prosecut'],['plea bargain',74,83,'cri','plea deal guilty'],
  ['easement',15,68,'pro','easement access land path neighbor'],['adverse possession',27,66,'pro','possession land squat title'],['fee simple',17,81,'pro','ownership title land'],['lien',30,80,'pro','lien debt mortgage property'],
  ['trustee',44,42,'tru','trustee fiduciary trust manage'],['beneficiary',54,40,'tru','beneficiary inherit trust share'],['no-contest clause',58,51,'tru','contest challenge disinherit clause'],['probate',46,55,'tru','probate estate court death'],['will (testament)',38,49,'tru','will testament mother father left inherit estate died death changed'],
  ['motion to dismiss',42,88,'civ','dismiss motion complaint'],['summary judgment',55,90,'civ','judgment summary trial'],['discovery',49,79,'civ','discovery documents deposition'],['standing',62,83,'civ','standing injury sue'],
  ['will ("I will go")',93,46,'odd','going future intend'],['consideration (kindness)',6,47,'odd','thoughtful kind polite']
];
const embSvg=$('#embSvg'),W=640,H=460,PAD=36;
const px=x=>PAD+x/100*(W-2*PAD), py=y=>PAD+y/100*(H-2*PAD);
let embSel=null, star=null;
function drawEmb(){
  embSvg.innerHTML='';
  const colored=$('#embColor').checked;
  // grid
  for(let i=0;i<=10;i++){el('line',{x1:px(i*10),y1:PAD,x2:px(i*10),y2:H-PAD,stroke:'#e6e1d3','stroke-width':1},embSvg);el('line',{x1:PAD,y1:py(i*10),x2:W-PAD,y2:py(i*10),stroke:'#e6e1d3','stroke-width':1},embSvg)}
  el('text',{x:W-PAD,y:H-10,'text-anchor':'end','font-family':'VT323, monospace','font-size':18,fill:C.lo},embSvg).textContent='dimension 1 of ~3,000 →';
  el('text',{x:12,y:PAD-8,'font-family':'VT323, monospace','font-size':18,fill:C.lo},embSvg).textContent='↑ dimension 2';
  // cluster halos
  if(colored){
    for(const k in CL){if(k==='odd')continue;const pts=TERMS.filter(t=>t[3]===k);const cx=pts.reduce((a,t)=>a+t[1],0)/pts.length,cy=pts.reduce((a,t)=>a+t[2],0)/pts.length;
      el('ellipse',{cx:px(cx),cy:py(cy),rx:78,ry:56,fill:CL[k].c,opacity:.13,stroke:CL[k].c,'stroke-width':2,'stroke-dasharray':'6 5'},embSvg)}
  }
  // neighbor lines
  if(embSel!=null){const nn=neighbors(TERMS[embSel][1],TERMS[embSel][2],embSel).slice(0,3);
    nn.forEach(n=>el('line',{x1:px(TERMS[embSel][1]),y1:py(TERMS[embSel][2]),x2:px(TERMS[n.i][1]),y2:py(TERMS[n.i][2]),stroke:C.pink,'stroke-width':3,'stroke-dasharray':'6 4'},embSvg))}
  if(star){star.nn.slice(0,3).forEach(n=>el('line',{x1:px(star.x),y1:py(star.y),x2:px(TERMS[n.i][1]),y2:py(TERMS[n.i][2]),stroke:C.grape,'stroke-width':3,'stroke-dasharray':'3 4'},embSvg))}
  TERMS.forEach((t,i)=>{
    const g=el('g',{class:'emb-pt'+(i===embSel?' sel':''),tabindex:'0',role:'button','aria-label':t[0],'data-hint':t[0]+' ('+CL[t[3]].n+'). Click for neighbours.'},embSvg);
    el('circle',{cx:px(t[1]),cy:py(t[2]),r:i===embSel?10:8,fill:colored?CL[t[3]].c:'#ffffff'},g);
    const lbl=el('text',{x:px(t[1])+(t[1]>80?-12:12),y:py(t[2])+4,'text-anchor':t[1]>80?'end':'start'},g);lbl.textContent=t[0];
    const pick=()=>{embSel=i;star=null;drawEmb();listNN(i);blip(500+i*10)};
    g.onclick=pick;g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick()}};
  });
  if(star){const s=el('text',{x:px(star.x),y:py(star.y)+10,'text-anchor':'middle','font-size':34,fill:C.lemon,stroke:C.ink,'stroke-width':1.5},embSvg);s.textContent='★'}
}
function neighbors(x,y,skip){return TERMS.map((t,i)=>({i,d:Math.hypot(t[1]-x,t[2]-y)})).filter(n=>n.i!==skip).sort((a,b)=>a.d-b.d)}
function simOf(d){return Math.max(0,1-d/90)}
function listNN(i,custom){
  const L=$('#nnList');L.innerHTML='';
  const nn=custom||neighbors(TERMS[i][1],TERMS[i][2],i);
  $('#nnHead').innerHTML=custom?'Closest concepts to your <b>★ question</b>:':'Closest to <b>'+esc(TERMS[i][0])+'</b>:';
  nn.slice(0,5).forEach(n=>{const s=simOf(n.d);const r=document.createElement('div');r.className='nn';
    r.innerHTML=`<span>${esc(TERMS[n.i][0])} <span class="tip">(${CL[TERMS[n.i][3]].n})</span></span><div class="bar" title="similarity ${s.toFixed(2)}"><i style="width:${s*100}%"></i></div>`;L.appendChild(r)});
  const far=nn[nn.length-1];const r=document.createElement('p');r.className='tip';r.textContent='Farthest away: '+TERMS[far.i][0]+'.';L.appendChild(r);
  const a=custom?{n:'★ question',x:star.x,y:star.y}:{n:TERMS[i][0],x:TERMS[i][1],y:TERMS[i][2]};const b=TERMS[nn[0].i];
  const ax=a.x-50,ay=50-a.y,bx=b[1]-50,by=50-b[2];const c=(ax*bx+ay*by)/(Math.hypot(ax,ay)*Math.hypot(bx,by)||1);
  $('#liveEmb').innerHTML=`‖“${esc(a.n)}” − “${esc(b[0])}”‖ = √((${a.x.toFixed(0)}−${b[1]})² + (${a.y.toFixed(0)}−${b[2]})²) = <b>${nn[0].d.toFixed(1)}</b> map units → closeness ${simOf(nn[0].d).toFixed(2)}. For contrast, their cosine measured from the map's centre is ${c.toFixed(2)}: cosine cares about direction, not distance.`;
}
function placeStar(){
  const q=$('#embQ').value.toLowerCase();let sx=0,sy=0,wsum=0;
  TERMS.forEach(t=>{const kws=t[4].split(' ');let hits=0;kws.forEach(k=>{if(k&&q.includes(k))hits++});if(t[3]==='odd')hits*=.3;if(hits){sx+=t[1]*hits;sy+=t[2]*hits;wsum+=hits}});
  if(!wsum){star=null;embSel=null;drawEmb();$('#embQNote').textContent='Nothing in this tiny vocabulary matched. A real embedding model knows tens of thousands of concepts, so try words like contract, land, crime, trust, motion.';$('#nnList').innerHTML='';return}
  star={x:sx/wsum,y:sy/wsum};award('mapmaker');star.nn=neighbors(star.x,star.y,-1);embSel=null;drawEmb();listNN(null,star.nn);
  $('#embQNote').textContent='The star lands near the concepts the question is about, even with no exact word overlap. That\'s semantic search.';blip(990);
}
const legend=$('#embLegend');for(const k in CL){legend.insertAdjacentHTML('beforeend',`<span><i style="background:${CL[k].c}"></i>${CL[k].n}</span>`)}
$('#embColor').onchange=drawEmb;$('#embGo').onclick=placeStar;$('#embQ').addEventListener('keydown',e=>{if(e.key==='Enter')placeStar()});
embSel=19;drawEmb();listNN(19);
  }};
