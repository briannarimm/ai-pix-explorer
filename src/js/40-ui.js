/* ==== UI: windows, toolbox, title, hub map, textbook reader, stickers, settings, timeline, log ==== */
const Win={
  current:null,
  open(o){
    this.close(true);
    const tb=h('div.titlebar',{style:`--tb1:${o.tb1||'var(--grape)'};--tb2:${o.tb2||'var(--sky)'}`},
      h('button.closebox',{type:'button','aria-label':'Close window',onclick:()=>Win.close(),'data-hint':'Close this window (Esc).'},'✕'),
      h('h2',o.title),(o.btns||[]).map(b=>h('button.tb-btn',{type:'button',onclick:b.fn,'data-hint':b.hint||''},b.t)));
    const w=h('div.vwin'+(o.cls?'.'+o.cls:''),{role:'dialog','aria-label':o.title},tb,o.mission||null,o.body,o.footer||null);
    if(o.cls&&/toy/.test(o.cls)){w.classList.add('toy')}
    $('#winlayer').appendChild(w);this.current={el:w,o};SND.play('open');
    UI.paintToolbox();
    const f=$('.closebox',w);if(f)setTimeout(()=>f.focus({preventScroll:true}),30);
    return this.current;
  },
  close(silent){
    const c=this.current;if(!c)return;this.current=null;
    if(c.o.onClose)try{c.o.onClose()}catch(e){console.error(e)}
    c.el.classList.add('closing');setTimeout(()=>c.el.remove(),reduceMotion()?0:150);
    if(!silent)SND.play('close');UI.paintToolbox();BUS.emit('win:close',c.o.id);
  }
};

/* ---------- registries filled by content files ---------- */
const LEVELS=[];          // {id,n,day,title,blurb,scene,color,toy,sticker,script:()=>beats}
const TOYS={};            // id -> {title,color,icon,level,build(),onOpen(),help}
const BOOK={};            // levelId -> {title,pages:[html...]}

const UI={
  built:false,
  /* ---- screens ---- */
  showGame(){
    $('#titlewin').hidden=true;$('#gamewin').hidden=false;
    if(!this.built){this.buildToolbox();this.buildPalette();this.built=true}
    if(!VN.bgName&&!VN.active){VN.bgName='lobby';$('#bgs').innerHTML=sceneSVG('lobby');VN.hideDlg()}
    this.paintToggles();this.paintToolbox();this.paintProg();
    window.scrollTo({top:0});
  },
  showTitle(){
    VN.active=false;VN.token++;VN.stopAll();Win.close(true);SND.stopMusic();
    $('#gamewin').hidden=true;$('#titlewin').hidden=false;this.buildTitle();window.scrollTo({top:0});
  },
  buildTitle(){
    const art=$('#titleArt');if(!art.querySelector('svg'))art.insertAdjacentHTML('afterbegin',TITLE_ART());
    const m=$('#titleMenu');m.innerHTML='';const has=G.started&&G.name;
    const newGame=()=>{
      m.innerHTML='';
      const inp=h('input',{type:'text',maxlength:'20',placeholder:'Your name',value:G.name||'','aria-label':'Your name',style:{textAlign:'center',fontFamily:'var(--display)'}});
      const go=()=>{const n=(inp.value||'').trim()||'Researcher';const keep=G.set;resetSave();G.set=keep;G.name=n;G.started=true;save();SND.unlock();UI.showGame();VN.start(0)};
      inp.addEventListener('keydown',e=>{if(e.key==='Enter')go()});
      m.append(h('div.label',{style:{textAlign:'center',color:'#fff',textShadow:'1px 1px 0 var(--ink)'}},'WHAT SHOULD THE LIBRARY CALL YOU?'),inp,h('button.btn.pink',{type:'button',onclick:go},'Start your first day ▶'),h('button.btn.small.lemon',{type:'button',onclick:()=>this.buildTitle()},'◀ Back'));
      setTimeout(()=>inp.focus(),30);
    };
    m.append(h('button.btn.pink',{type:'button',onclick:newGame,'data-hint':'Start from the beginning.'},has?'New game':'Start the adventure ▶'));
    if(has)m.append(h('button.btn.lime',{type:'button',onclick:()=>{SND.unlock();UI.showGame();const idx=clamp(G.lvl,0,LEVELS.length-1);VN.start(idx,G.beat||0)},'data-hint':'Pick up where you left off.'},`Continue: Level ${G.lvl}`));
    m.append(h('button.btn.sky',{type:'button',onclick:()=>{if(!G.name)G.name='Researcher';G.started=true;SND.unlock();UI.showGame();VN.active=false;UI.openHub()},'data-hint':'Skip the story. Open the toy box, textbook and map.'},'Toy box and textbook'));
    m.append(h('button.btn.small.lemon',{type:'button','aria-pressed':G.set.sound,onclick:e=>{G.set.sound=!G.set.sound;G.set.music=G.set.sound;save();UI.paintToggles();if(G.set.sound){SND.unlock();SND.play('tada')}e.target.textContent='Sound: '+(G.set.sound?'on':'off')}},'Sound: '+(G.set.sound?'on':'off')));
  },
  paintWhere(){const L=VN.lvl;if(!L)return;$('#whereDay').textContent=L.day.toUpperCase().slice(0,3)+' · LVL '+L.n;$('#whereLvl').textContent=L.title},
  paintProg(){$('#progTxt').textContent=`Stickers ${Object.keys(G.stickers).length}/${STICKERS.length}`},
  paintToggles(){
    $('#autoBtn').setAttribute('aria-pressed',VN.auto);$('#skipBtn').setAttribute('aria-pressed',VN.skip);
    const sb=$('#soundBtn');sb.setAttribute('aria-pressed',G.set.sound);sb.textContent='Sound: '+(G.set.sound?'on':'off');
  },
  /* ---- toolbox ---- */
  TOOLDEFS(){
    const T=Object.keys(TOYS).sort((a,b)=>(TOYS[a].level-TOYS[b].level)||((TOYS[a].ord||0)-(TOYS[b].ord||0))).map(id=>({id,kind:'toy',label:TOYS[id].short||TOYS[id].title,icon:TOYS[id].icon,color:TOYS[id].color,level:TOYS[id].level}));
    return [
      {grp:'Read & explore'},
      {id:'book',kind:'book',label:'Textbook',icon:ICONS.book,color:'var(--pink)',hint:'The textbook: every lesson, the glossary and the references.'},
      {id:'hub',kind:'hub',label:'Hollis Hall',icon:ICONS.hub,color:'var(--lemon)',hint:'Floor plan: jump to any level.'},
      {id:'time',kind:'time',label:'Time Machine',icon:ICONS.time,color:'var(--sky)',hint:'A timeline of the papers behind this game, 1943 to 2026.'},
      {id:'stickers',kind:'stickers',label:'Stickers',icon:ICONS.stickers,color:'var(--lime)',hint:'Your sticker book.'},
      {grp:'Toys'},...T,
      {grp:'Options'},
      {id:'settings',kind:'settings',label:'Settings',icon:ICONS.gear,color:'var(--silver)',hint:'Sound, text speed, save and title screen.'}
    ];
  },
  buildToolbox(){
    const outer=$('#toolbox');outer.innerHTML='';const box=h('div.tbin');outer.appendChild(box);
    this.TOOLDEFS().forEach(t=>{
      if(t.grp){box.appendChild(h('div.grp',t.grp));return}
      const b=h('button.tool',{type:'button','data-tool':t.id,'data-kind':t.kind,style:`--c:${t.color}`,'data-hint':t.hint||('Open the '+t.label+' toy.'),'aria-pressed':'false',onclick:()=>UI.useTool(t)},
        h('span',{html:t.icon,style:{display:'contents'}}),t.label);
      box.appendChild(b);
    });
    $('#tbBtn').onclick=()=>this.toolSheet();
  },
  paintToolbox(){
    $$('.tool').forEach(b=>{
      const id=b.dataset.tool,kind=b.dataset.kind;
      const open=Win.current&&Win.current.o.id===(kind==='toy'?'toy:'+id:id);
      b.setAttribute('aria-pressed',!!open);
      b.querySelectorAll('.new,.done').forEach(n=>n.remove());
      if(kind==='toy'){const T=TOYS[id];const u=G.toys[id];
        if(u&&u.used)b.appendChild(h('span.done','✔'));else if(!u&&T.level<=Math.max(G.lvl,VN.lvlIdx))b.appendChild(h('span.new','NEW'))}
      if(id==='stickers'&&Object.keys(G.stickers).length)b.title=Object.keys(G.stickers).length+' collected';
    });
    this.paintProg();
  },
  useTool(t){
    SND.play('tool');
    if(t.kind==='toy')return this.openToy(t.id);
    if(t.kind==='book')return this.openBook();
    if(t.kind==='hub')return this.openHub();
    if(t.kind==='time')return this.openTime();
    if(t.kind==='stickers')return this.openStickers();
    if(t.kind==='settings')return this.openSettings();
  },
  toolSheet(){
    const grid=h('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(88px,1fr))',gap:'10px'}});
    this.TOOLDEFS().forEach(t=>{if(t.grp){grid.appendChild(h('div.label',{style:{gridColumn:'1/-1'}},t.grp));return}
      grid.appendChild(h('button.tool',{type:'button',style:`--c:${t.color}`,onclick:()=>{Win.close(true);UI.useTool(t)}},h('span',{html:t.icon,style:{display:'contents'}}),t.label))});
    Win.open({id:'sheet',title:'Toolbox',tb1:'var(--pink)',tb2:'var(--tang)',body:h('div.wbody',grid)});
  },
  /* ---- chapter palette ---- */
  buildPalette(){
    const p=$('#palette');p.innerHTML='';p.appendChild(h('span.lbl','LEVELS'));
    const cols=['--lemon','--pink','--sky','--lime','--grape','--tang'];
    LEVELS.forEach((L,i)=>p.appendChild(h('button.sw',{type:'button','data-i':i,style:`--c:var(${cols[i%6]})`,'aria-label':`Level ${L.n}: ${L.title}`,'data-hint':`Level ${L.n}: ${L.title}`,onclick:()=>UI.levelMenu(i)},String(L.n))));
  },
  paintPalette(){$$('.sw').forEach(b=>{const i=+b.dataset.i,L=LEVELS[i];b.classList.toggle('done',!!G.done[L.id]);b.classList.toggle('todo',!G.done[L.id]&&i>Math.max(VN.lvlIdx,G.lvl));b.setAttribute('aria-current',i===VN.lvlIdx)})},
  /* ---- level menu (from palette or map) ---- */
  levelMenu(i){
    const L=LEVELS[i];const body=h('div.wbody',
      h('div.canvas',{style:{display:'grid',gap:'10px'}},h('div.label',`DAY ${L.day.toUpperCase()} · LEVEL ${L.n}`),h('h3',{style:{fontSize:'20px'}},L.title),h('p',{html:rich(L.blurb)}),
        h('div.row',
          h('button.btn.pink',{type:'button',onclick:()=>{Win.close(true);VN.start(i)}},G.done[L.id]?'Replay the story':'Play this level ▶'),
          BOOK[L.id]?h('button.btn.sky',{type:'button',onclick:()=>{Win.close(true);UI.openBook(L.id)}},'Read the chapter'):null,
          L.toy?h('button.btn.lemon',{type:'button',onclick:()=>{Win.close(true);UI.openToy(L.toy)}},'Just the toy'):null)));
    Win.open({id:'level',title:`Level ${L.n}: ${L.title}`,tb1:'var(--lemon)',tb2:'var(--tang)',body});
  },
  /* ---- floor plan ---- */
  openHub(){
    const W=960,Hh=640,cols=5,cw=176,chh=132,gx=14,gy=34,x0=26,y0=28;
    const parts=[`<svg class="floorplan" viewBox="0 0 ${W} ${Hh}" xmlns="${NS}" role="group" aria-label="Floor plan of Hollis Hall">`,
      `<rect x="4" y="4" width="${W-8}" height="${Hh-8}" rx="16" fill="#f4ecd8" stroke="#1a1033" stroke-width="5"/>`,
      `<text x="${W/2}" y="26" text-anchor="middle" font-family="Bungee" font-size="16" fill="#1a1033">HOLLIS HALL LAW LIBRARY · FLOOR PLAN</text>`];
    LEVELS.forEach((L,i)=>{const c=i%cols,r=Math.floor(i/cols);const x=x0+c*(cw+gx),y=y0+gy+r*(chh+gy+10);const sc=SCENES[L.scene]||SCENES.lobby;
      const done=!!G.done[L.id],cur=i===VN.lvlIdx;
      parts.push(`<g class="fp-room" tabindex="0" role="button" aria-label="Level ${L.n}: ${esc(L.title)}${done?' (done)':''}" data-i="${i}" data-hint="Level ${L.n}: ${esc(L.title)}">
        <rect class="r" x="${x}" y="${y}" width="${cw}" height="${chh+22}" rx="8" fill="#fffdf4"/>
        <svg x="${x+4}" y="${y+4}" width="${cw-8}" height="${(cw-8)*.75}" viewBox="0 0 960 720" preserveAspectRatio="xMidYMid slice">${sc.draw()}</svg>
        <rect x="${x+4}" y="${y+chh-10}" width="${cw-8}" height="28" fill="#fffdf4" stroke="#1a1033" stroke-width="2.5"/>
        <text x="${x+cw/2}" y="${y+chh+9}" text-anchor="middle">${esc(L.title.length>20?L.title.slice(0,19)+'…':L.title)}</text>
        <circle cx="${x+4}" cy="${y+4}" r="15" fill="${done?'#36d65a':'#ffd92e'}" stroke="#1a1033" stroke-width="3"/><text x="${x+4}" y="${y+10}" text-anchor="middle" style="font-size:14px">${done?'✔':L.n}</text>
        ${cur?`<rect x="${x-3}" y="${y-3}" width="${cw+6}" height="${chh+28}" rx="10" fill="none" stroke="#ff2d95" stroke-width="4" stroke-dasharray="8 6"/>`:''}
      </g>`)});
    parts.push('</svg>');
    const body=h('div.wbody',h('p.tip',{style:{margin:0}},'Click a room to play that level, read its chapter or open its toy. Rooms you finished show a green check.'),h('div.scroll-x',{html:parts.join('')}));
    Win.open({id:'hub',title:'Hollis Hall',tb1:'var(--lemon)',tb2:'var(--tang)',body});
    $$('.fp-room',body).forEach(g=>{const f=()=>UI.levelMenu(+g.dataset.i);g.onclick=f;g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f()}}});
  },
  /* ---- toy windows ---- */
  openToy(id,opts={}){
    const T=TOYS[id];if(!T)return;
    return new Promise(res=>{
      const root=$('#toy-'+id);if(!root){res();return}
      G.toys[id]=Object.assign(G.toys[id]||{},{seen:1});save();
      const goals=(opts.goals||[]).map(g=>Object.assign({n:1,c:0,ok:false},g));
      const mission=h('div.mission');
      const paint=()=>{mission.innerHTML='';if(!goals.length&&!opts.note)return;
        if(opts.note)mission.appendChild(h('span',{html:rich(opts.note)}));
        if(goals.length){mission.appendChild(h('b','MISSION'));goals.forEach(g=>mission.appendChild(h('span.g'+(g.ok?'.ok':''),h('i',g.ok?'✔':''),h('span',g.text))))}};
      paint();
      let allOk=!goals.length;const foot=h('div.wfoot');
      const cont=h('button.btn',{type:'button',onclick:()=>Win.close()},opts.story?'Skip ahead ▶':'Close');
      const bookBtn=BOOK[LEVELS[T.level]&&LEVELS[T.level].id]?h('button.btn.small.sky',{type:'button',onclick:()=>{Win.close(true);UI.openBook(LEVELS[T.level].id)}},'Open the chapter'):null;
      foot.append(h('span.tip',{style:{margin:0}},T.help||'Everything here is a toy: poke it.'),h('div.row',bookBtn,cont));
      const listeners=[];
      const hook=ev=>{goals.forEach(g=>{if(g.ok||g.on!==ev.type)return;const hit=(g.sel?ev.target.closest&&ev.target.closest(g.sel):true);if(!hit)return;g.c++;if(g.c>=g.n){g.ok=true;SND.play('ok')}});
        G.toys[id].used=1;save();paint();
        const now=goals.every(g=>g.ok);if(now&&!allOk){allOk=true;cont.textContent=opts.story?'Continue the story ▶':'Close';cont.classList.add('pink','big')}if(goals.length&&goals.every(g=>g.ok)){cont.textContent=opts.story?'Continue the story ▶':'Close';cont.classList.add('pink')}
        BUS.emit('toy:'+id,ev)};
      ['click','input','change'].forEach(t=>{root.addEventListener(t,hook,true)});
      if(allOk&&opts.story){cont.textContent='Continue the story ▶';cont.classList.add('pink')}
      const body=h('div.wbody',root);root.hidden=false;
      Win.open({id:'toy:'+id,title:T.title,tb1:T.tb1||'var(--sky)',tb2:T.tb2||'var(--grape)',cls:'toy',mission,body,footer:foot,
        btns:[{t:'TEXTBOOK',fn:()=>{Win.close(true);UI.openBook(LEVELS[T.level]?LEVELS[T.level].id:undefined)},hint:'Open the chapter that explains this toy.'}],
        onClose:()=>{['click','input','change'].forEach(t=>root.removeEventListener(t,hook,true));root.hidden=true;$('#toyshelf').appendChild(root);if(T.onClose)T.onClose();UI.paintToolbox();res(goals.length?goals.every(g=>g.ok):true)}});
      if(T.onOpen)requestAnimationFrame(()=>T.onOpen());
    });
  },
  toyWait(id,goals,note,b){return this.openToy(id,{goals,note,story:true})},
  toolWait(kind){return new Promise(res=>{this.useTool({kind});const off=BUS.on('win:close',()=>{off();res()})})},
  /* ---- book ---- */
  bookWait(levelId,at,note){return new Promise(res=>{this.openBook(levelId,at,{onClose:res,story:true,note})})},
  openBook(lvlId,page=0,opts={}){
    const tabs=[['contents','Contents'],['glossary','Glossary'],['refs','References']];
    const sections=()=>{const o=[];LEVELS.forEach(L=>{if(BOOK[L.id])o.push(L.id)});return o};
    let cur=lvlId&&(BOOK[lvlId]||['contents','glossary','refs'].includes(lvlId))?lvlId:(VN.lvl&&BOOK[VN.lvl.id]?VN.lvl.id:'contents');
    let p=page;
    const book=h('div.book'),bar=h('div.bookbar'),wrap=h('div.wbody',book,bar);
    const pagesFor=id=>{
      if(id==='contents')return [tocPage(0),tocPage(1)];
      if(id==='glossary')return glossaryPages();
      if(id==='refs')return refPages();
      const B=BOOK[id];return B?B.pages.map((html,i)=>pageWrap(rich(html),id,i)):[];
    };
    function pageWrap(html,id,i){const L=LEVELS.find(l=>l.id===id);const refs=refsIn(html);
      const col={'--bc':`var(${['--lemon','--pink-l','--sky-l','--lime-l','--grape-l','--tang-l'][(L?L.n:0)%6]})`,'--bc2':`var(${['--grape','--pink','--sky','--lime','--tang','--grape'][(L?L.n:0)%6]})`};
      return {html:`<div class="runhead"><span>${L?`Level ${L.n} · ${esc(L.title)}`:''}</span><span>AI Pix Explorer</span></div>${html}${refs.length?`<div class="refs"><b>REFERENCES ON THIS PAGE</b>${refs.map(k=>`<p>${REFS[k].apa}</p>`).join('')}</div>`:''}`,style:col}}
    function tocPage(half){
      const all=LEVELS.filter(L=>BOOK[L.id]);const per=8;const part=all.slice(half*per,half*per+per);
      return {html:`<div class="runhead"><span>Contents</span><span>AI Pix Explorer</span></div>${half===0?`<h2><small>THE TEXTBOOK</small>Contents</h2><p>Every level has a chapter. Read before a level, during it or after. Click a title to open it. Citations in small gray type open the full APA reference. The back of the book holds the glossary and every reference.</p>`:'<h2><small>CONTINUED</small>Contents</h2>'}<div class="toc">${part.map(L=>`<button type="button" data-open="${L.id}"><b>${L.n}</b><span>${esc(L.title)}</span><span class="p">${BOOK[L.id].pages.length} pp</span></button>`).join('')}</div>`,style:{}}
    }
    function glossaryPages(){const seenT=new Set();const keys=Object.keys(GLOSS).filter(k=>{const t=GLOSS[k].t;if(seenT.has(t))return false;seenT.add(t);return true}).sort((a,b)=>GLOSS[a].t.localeCompare(GLOSS[b].t));const per=5;const out=[];
      for(let i=0;i<keys.length;i+=per){out.push({html:`<div class="runhead"><span>Glossary</span><span>AI Pix Explorer</span></div>${i===0?'<h2><small>CHEAT SHEET</small>Glossary</h2><p>Each term has a plain definition, an everyday comparison, and the machine-learning name you may already know.</p>':'<h2><small>CHEAT SHEET</small>Glossary, cont.</h2>'}<div class="gl-grid">${keys.slice(i,i+per).map(k=>{const g=GLOSS[k];return `<div class="gcard" id="g-${k}"><h4>${esc(g.t)}</h4><p>${rich(g.d)}</p><p class="like"><b>Like:</b> ${esc(g.like)}</p><p class="ml"><b>ML:</b> ${esc(g.ml)}</p></div>`}).join('')}</div>`,style:{}})}return out}
    function refPages(){const keys=Object.keys(REFS).filter(k=>!REFS[k].hidden||true).sort((a,b)=>REFS[a].apa.replace(/<[^>]+>/g,'').localeCompare(REFS[b].apa.replace(/<[^>]+>/g,'')));const per=6;const out=[];
      for(let i=0;i<keys.length;i+=per){out.push({html:`<div class="runhead"><span>References</span><span>AI Pix Explorer</span></div>${i===0?'<h2><small>BIBLIOGRAPHY</small>References</h2><p style="font-size:.9em">APA 7th edition. Every source below is one of the background papers that shaped this game. Cases, memos and citations inside the story are fictional and labeled.</p>':'<h2><small>BIBLIOGRAPHY</small>References, cont.</h2>'}<div class="refs" style="border:0;margin:0;padding:0;font-size:14px;line-height:1.45">${keys.slice(i,i+per).map(k=>`<p id="ref-${k}">${REFS[k].apa}<br><span style="color:var(--grape)">Level${(REFS[k].lvl||[]).length>1?'s':''} ${(REFS[k].lvl||[]).join(', ')}</span></p>`).join('')}</div>`,style:{}})}return out}
    let pages=[];
    const draw=(dir=1)=>{
      pages=pagesFor(cur);p=clamp(p,0,Math.max(0,pages.length-1));if(p%2)p--; // left page index is even
      book.innerHTML='';book.style.setProperty('--fx',dir>0?'14px':'-14px');
      const mk=(pg,side,idx)=>{const d=h('div.pg.'+side);if(!pg){d.classList.add('blank');d.textContent='· · ·';return d}
        d.innerHTML=pg.html+`<span class="pnum">${idx+1}</span>`;Object.entries(pg.style||{}).forEach(([k,v])=>d.style.setProperty(k,v));return d};
      book.append(mk(pages[p],'left',p),mk(pages[p+1],'right',p+1));
      book.classList.toggle('show2',false);
      bar.innerHTML='';
      const prev=h('button.btn.small.lemon',{type:'button',disabled:p<=0,onclick:()=>{p-=2;SND.play('page');draw(-1)}},'◀ Back');
      const next=h('button.btn.small.lemon',{type:'button',disabled:p+2>=pages.length,onclick:()=>{p+=2;SND.play('page');draw(1)}},'Next ▶');
      const mob=h('button.btn.small.sky.mobile-only',{type:'button',onclick:()=>{book.classList.toggle('show2')}},'Other page');
      const bm=h('div.bookmarks',tabs.map(([id,t])=>h('button.bm',{type:'button','aria-pressed':cur===id,onclick:()=>{cur=id;p=0;SND.play('page');draw()}},t)),
        h('select',{'aria-label':'Chapter',style:{width:'auto',fontSize:'13px',padding:'2px 6px'},onchange:e=>{cur=e.target.value;p=0;SND.play('page');draw()}},[['contents','Go to chapter…'],...sections().map(id=>{const L=LEVELS.find(l=>l.id===id);return [id,`${L.n}. ${L.title}`]})].map(([v,t])=>h('option',{value:v,selected:cur===v?'':null},t))));
      bar.append(bm,h('span.pi',`${cur==='contents'||cur==='glossary'||cur==='refs'?cur:'Level '+(LEVELS.find(l=>l.id===cur)||{}).n} · ${matchMedia('(max-width:860px)').matches&&!book.classList.contains('show2')?'page '+(p+1):'pp '+(p+1)+(pages[p+1]?'–'+(p+2):'')} of ${pages.length}`),h('div.row',prev,next,mob,opts.story?h('button.btn.small.pink',{type:'button',onclick:()=>Win.close()},'Back to the story ▶'):null));
      // open a chapter from the contents page
      $$('[data-open]',book).forEach(b=>b.onclick=()=>{cur=b.dataset.open;p=0;SND.play('page');draw()});
      $$('[data-toy]',book).forEach(b=>b.onclick=()=>{Win.close(true);UI.openToy(b.dataset.toy)});
      // reading tracking
      if(BOOK[cur]){const seen=(G.flags['pg:'+cur]=G.flags['pg:'+cur]||{});seen[p]=1;if(pages[p+1])seen[p+1]=1;if(Object.keys(seen).length>=pages.length)award('reader');save()}
      $$('.nerdbox',book).forEach(d=>d.addEventListener('toggle',()=>{if(d.open)award('nerd')}));
      $$('.pg',book).forEach(d=>d.scrollTop=0);
    };
    Win.open({id:'book',title:'The Textbook',cls:'bookwin',tb1:'var(--grape)',tb2:'var(--sky)',body:wrap,onClose:()=>{if(opts.onClose)opts.onClose()}});
    draw();
  },
  /* ---- stickers ---- */
  openStickers(){
    const body=h('div.wbody',h('p.tip',{style:{margin:0}},`You have ${Object.keys(G.stickers).length} of ${STICKERS.length}. Each one comes from doing something, not just reading.`),
      h('div.stickers',STICKERS.map(([id,name,how,svg])=>{const got=G.stickers[id];return h('div.stk'+(got?'':'.locked'),{html:svg+`<span>${esc(got?name:'???')}</span><small>${esc(got?how:'Keep exploring.')}</small>`})})));
    Win.open({id:'stickers',title:'Sticker Book',tb1:'var(--lime)',tb2:'var(--lemon)',body});
  },
  /* ---- settings ---- */
  openSettings(){
    const seg=(key,opts)=>h('div.seg',opts.map(([v,t])=>h('button',{type:'button','aria-pressed':String(G.set[key])===String(v),onclick:e=>{G.set[key]=v;save();$$('button',e.target.parentNode).forEach(b=>b.setAttribute('aria-pressed',b===e.target));if(key==='music'){v?(SND.unlock(),SND.music(VN.lvl?VN.lvl.music:'hub')):SND.stopMusic()}if(key==='sound'){UI.paintToggles()}}},t)));
    const rows=h('div.wbody',
      h('div.setrow',h('div','Sound effects',h('small','Beeps, blips and chimes.')),seg('sound',[[true,'On'],[false,'Off']])),
      h('div.setrow',h('div','Music',h('small','A tiny chiptune loop. Needs sound on.')),seg('music',[[true,'On'],[false,'Off']])),
      h('div.setrow',h('div','Text speed'),seg('speed',[['slow','Slow'],['normal','Normal'],['fast','Fast'],['instant','Instant']])),
      h('div.setrow',h('div','Click sparkles'),seg('sparkle',[[true,'On'],[false,'Off']])),
      h('div.setrow',h('div','Keys',h('small','Space or Enter: next. A: auto. L: log. 1 to 4: pick a choice. Esc: close a window.')),h('span.kbd','Space')),
      h('div.setrow',h('div','Title screen'),h('button.btn.small.sky',{type:'button',onclick:()=>{Win.close(true);UI.showTitle()}},'Go to title')),
      h('div.setrow',h('div','Erase progress',h('small','Removes your name, stickers and level progress from this browser.')),h('button.btn.small.pink',{type:'button',onclick:e=>{const b=e.target;if(!b.dataset.arm){b.dataset.arm=1;b.textContent='Click again to erase';return}resetSave();Win.close(true);UI.showTitle()}},'Erase')));
    Win.open({id:'settings',title:'Settings',tb1:'var(--silver)',tb2:'var(--lo)',body:rows});
  },
  /* ---- timeline ---- */
  openTime(){
    const eras=Object.keys(ERA_NAMES);let era='all',sel=null;
    const body=h('div.wbody');
    const draw=()=>{
      body.innerHTML='';
      const filt=h('div.filters',h('button.hl-btn',{type:'button','aria-pressed':era==='all',onclick:()=>{era='all';draw()}},'All eras'),eras.map(e=>h('button.hl-btn',{type:'button','aria-pressed':era===e,onclick:()=>{era=e;draw()}},ERA_NAMES[e])));
      const list=Object.values(REFS).filter(r=>!r.hidden&&(era==='all'||r.era===era)).sort((a,b)=>a.y-b.y||a.a1.localeCompare(b.a1));
      const bg={roots:'--lemon-l',learning:'--lime-l',language:'--sky-l',tuning:'--grape-l',now:'--pink-l'};
      const tl=h('div.tl-scroll',h('div.tl',list.map(r=>h('button.tl-card'+(sel===r.k?'.sel':''),{type:'button',style:`--c:var(${bg[r.era]})`,onclick:()=>{sel=r.k;SND.play('click');G.flags.tt=(G.flags.tt||[]);if(!G.flags.tt.includes(r.era)){G.flags.tt.push(r.era);if(G.flags.tt.length>=3)award('timetravel')}save();draw()}},h('span.y',String(r.y)),h('b',r.short),h('span',r.line)))));
      body.append(h('p.tip',{style:{margin:0}},'Every paper behind this game, in order. Click a card for the reference and the level where it shows up.'),filt,tl);
      if(sel){const r=REFS[sel];body.appendChild(h('div.tl-detail',h('h3',`${r.y} · ${r.short}`),h('p',r.line),h('p.apa',{html:r.apa}),
        h('div.row',(r.lvl||[]).map(n=>{const i=LEVELS.findIndex(l=>l.n===n);return i>=0?h('button.btn.small.lemon',{type:'button',onclick:()=>{Win.close(true);UI.levelMenu(i)}},'Level '+n+': '+LEVELS[i].title):null}))))}
      const sc=body.querySelector('.tl-card.sel');if(sc)sc.scrollIntoView({inline:'center',block:'nearest'});
    };
    Win.open({id:'time',title:'Time Machine',tb1:'var(--sky)',tb2:'var(--grape)',body});draw();
  },
  /* ---- backlog ---- */
  openLog(){
    const body=h('div.wbody',h('div.backlog',VN.hist.length?VN.hist.map(l=>h('div.ln',{style:{'--nc':l.color}},l.who?h('b',l.who):null,h('div',{html:l.html}))):h('p.tip','Nothing yet. Lines you read will collect here.')));
    Win.open({id:'log',title:'Story Log',tb1:'var(--tang)',tb2:'var(--pink)',body});
    const b=$('.wbody',Win.current.el);b.scrollTop=b.scrollHeight;
  }
};

/* ---------- buttons in the top bar ---------- */
$('#logBtn').onclick=()=>UI.openLog();
$('#autoBtn').onclick=()=>{VN.auto=!VN.auto;if(VN.auto)VN.skip=false;UI.paintToggles();if(VN.auto&&VN.waiter&&!VN.typing)VN.advance()};
$('#skipBtn').onclick=()=>{VN.skip=!VN.skip;if(VN.skip)VN.auto=false;UI.paintToggles();if(VN.skip&&VN.waiter&&!VN.typing&&G.seen[VN.lvlIdx+':'+VN.i])VN.advance()};
$('#soundBtn').onclick=()=>{G.set.sound=!G.set.sound;G.set.music=G.set.sound;save();UI.paintToggles();if(G.set.sound){SND.unlock();SND.play('tada');SND.music(VN.lvl?VN.lvl.music||'hub':'hub')}else SND.stopMusic()};
$('#menuBtn').onclick=()=>UI.openSettings();

/* ---------- citation + glossary popovers ---------- */
let popEl=null;
function closePop(){if(popEl){popEl.remove();popEl=null}}
function showPop(node,html,extra){
  closePop();const r=node.getBoundingClientRect();
  popEl=h('div.citepop',{role:'tooltip',html});$('#floaters').appendChild(popEl);
  if(extra)popEl.appendChild(extra);
  const pw=popEl.offsetWidth,ph=popEl.offsetHeight;
  let x=clamp(r.left,8,innerWidth-pw-8),y=r.bottom+6;if(y+ph>innerHeight-8)y=Math.max(8,r.top-ph-6);
  popEl.style.left=x+'px';popEl.style.top=y+'px';
}
document.addEventListener('click',e=>{
  const c=e.target.closest&&e.target.closest('cite[data-ref]');
  if(c){e.preventDefault();e.stopPropagation();const keys=c.dataset.ref.split(',');
    const html=keys.map(k=>`<div class="apa">${REFS[k].apa}</div><span class="lvl">Used in level${(REFS[k].lvl||[]).length>1?'s':''} ${(REFS[k].lvl||[]).join(', ')}</span>`).join('<hr style="border:0;border-top:1px dashed #bbb;margin:6px 0">');
    award('citechecker');showPop(c,html,h('button.btn.small.lemon',{type:'button',onclick:()=>{closePop();UI.openBook('refs')}},'Open the reference list'));return}
  const t=e.target.closest&&e.target.closest('.term[data-term]');
  if(t){e.preventDefault();e.stopPropagation();const g=GLOSS[t.dataset.term];if(g)showPop(t,`<b>${esc(g.t)}</b><br>${rich(g.d)}<br><span class="lvl"><b>Like:</b> ${esc(g.like)}</span>`);return}
  if(popEl&&!e.target.closest('.citepop'))closePop();
},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePop();
  const t=e.target;if((e.key==='Enter'||e.key===' ')&&t.matches&&t.matches('cite[data-ref],.term[data-term]')){e.preventDefault();t.click()}});
