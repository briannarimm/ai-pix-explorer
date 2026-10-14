/* ==== VISUAL-NOVEL ENGINE ====
   A level is an array of "beats". The interpreter runs them one at a time and waits for the player where it needs to.
   Beats:  {bg:'lobby'}  {cast:{quill:{pos:'L',mood:'happy'}, pixel:null}}  {who:'quill',mood:'happy',t:'text'}  {narr:'text'}
           {choice:{opts:[{t,go|then}]}}  {label:'x'} {go:'x'}  {book:'levelId',at:0}  {toy:'id',goals:[...]}  {ask:{q,opts}}
           {hot:{items:{name:[beats]},need:2,prompt}}  {sticker:'id'}  {card:{day,time,sub}}  {sfx:'ok'}  {music:'hub'}  {wait:600}
           {flash:true}  {end:{learned:[..]}}                                                                              */
const VN={
  lvl:null,script:[],labels:{},i:0,token:0,cast:{},bgName:null,waiter:null,typing:null,auto:false,skip:false,hist:[],quiz:{r:0,t:0},lvlIdx:-1,active:false,
  POS:{L:'2%',ML:'20%',C:'31%',MR:'44%',R:'62%'},
  speed(){return {slow:26,normal:14,fast:6,instant:0}[G.set.speed]??14},
  /* ---- starting and stopping ---- */
  async start(idx,fromBeat=0){
    const L=LEVELS[idx];if(!L)return;
    this.token++;const tk=this.token;this.stopAll();
    this.lvl=L;this.lvlIdx=idx;this.script=L.script();this.labels={};
    this.script.forEach((b,i)=>{if(b&&b.label)this.labels[b.label]=i});
    this.quiz={r:0,t:0};this.hist=[];this.active=true;
    G.lvl=idx;G.beat=fromBeat;G.started=true;save();
    UI.showGame();UI.paintWhere();UI.paintPalette();
    this.clearCast(true);this.hideDlg();
    await this.run(this.script,fromBeat,tk,true);
  },
  stopAll(){if(this.hotHandler){$('#hots').removeEventListener('click',this.hotHandler);this.hotHandler=null}const hb=$('#hots');if(hb)hb.style.pointerEvents='';this.waiter=null;if(this.typing)this.typing.stop();this.typing=null;this.auto=false;this.skip=false;UI.paintToggles();$('#hots').innerHTML='';$('#choices').hidden=true;$('#choices').innerHTML='';$$('.quizcard,.overlay,.confetti').forEach(n=>n.remove())},
  async run(beats,from,tk,top){
    let i=from;
    while(i<beats.length&&tk===this.token){
      const b=beats[i];if(!b){i++;continue}
      if(top){this.i=i;if(b.bg||b.card){G.beat=i;save()}}
      let r;try{r=await this.beat(b,tk)}catch(e){console.error('beat error',e,b);r=undefined}
      if(tk!==this.token)return;
      if(r&&r.go!==undefined){const j=this.labels[r.go];if(j===undefined){console.warn('unknown label',r.go);i++}else{if(!top)return r;i=j}}
      else i++;
    }
  },
  /* ---- one beat ---- */
  async beat(b,tk){
    if(b.label&&Object.keys(b).length===1)return;
    if(b.sfx)SND.play(b.sfx);
    if(b.music)SND.setMood(b.music),SND.music(b.music);
    if(b.set)Object.assign(G.flags,b.set);
    if(b.card)return this.card(b.card,tk);
    if(b.bg){await this.setBG(b.bg,b.iris!==false)}
    if(b.hotspots!==undefined&&!b.hot)this.hotSet=b.hotspots;
    if(b.cast){await this.setCast(b.cast)}
    if(b.flash)this.flash();
    if(b.wait){await sleep(b.wait)}
    if(b.sticker)award(b.sticker);
    if(b.t!==undefined||b.narr!==undefined||b.say!==undefined)return this.say(b,tk);
    if(b.choice)return this.choice(b.choice,tk);
    if(b.ask)return this.ask(b.ask,tk);
    if(b.book)return UI.bookWait(b.book,b.at||0,b.note);
    if(b.tool)return UI.toolWait(b.tool);
    if(b.toy)return UI.toyWait(b.toy,b.goals||[],b.note,b);
    if(b.hot)return this.hot(b.hot,tk);
    if(b.when){const v=G.flags[b.when.flag]||0;if(v>=b.when.gte)return {go:b.when.go}}
    if(b.cert)return this.cert(tk);
    if(b.go)return {go:b.go};
    if(b.end)return this.end(b.end,tk);
  },
  /* ---- backgrounds, cast ---- */
  async setBG(name,iris=true){
    const bgs=$('#bgs');if(this.bgName===name)return;
    const ir=$('#iris');
    if(iris&&this.bgName&&!reduceMotion()){document.body.classList.add('busy');ir.classList.add('closed');await sleep(520)}
    bgs.innerHTML=sceneSVG(name);this.bgName=name;this.paintHots();
    if(iris&&!reduceMotion()){await sleep(60);ir.classList.remove('closed');await sleep(300)}
    document.body.classList.remove('busy');
    SND.play('page');
  },
  paintHots(items,done={}){
    const box=$('#hots');box.innerHTML='';if(!items)return;const sc=SCENES[this.bgName];if(!sc)return;
    items.forEach(k=>{const hs=sc.hot[k];if(!hs)return;
      const b=h('button.hot',{type:'button','data-k':k,'aria-label':hs.label,'data-hint':'Click to look at: '+hs.label+'.',style:{left:hs.x/9.6+'%',top:hs.y/7.2+'%',width:hs.w/9.6+'%',height:hs.h/7.2+'%'}},h('span.tag',hs.label));
      if(done[k])b.classList.add('done');box.appendChild(b)})
  },
  clearCast(instant){const c=$('#cast');c.innerHTML='';this.cast={}},
  async setCast(spec){
    const c=$('#cast');
    for(const id in spec){const s=spec[id];
      if(s===null||s===false){const cur=this.cast[id];if(cur){cur.el.classList.add('leave');setTimeout(()=>cur.el.remove(),350);delete this.cast[id]}continue}
      let cur=this.cast[id];const mood=s.mood||(cur&&cur.mood)||(id==='whitlock'?'stern':'neutral');
      if(!cur){const el=h('div.sprite.enter',{'data-id':id,style:{left:this.POS[s.pos||'C']}});if(s.small)el.classList.add('small');
        el.innerHTML=charSVG(id,mood,s);c.appendChild(el);cur=this.cast[id]={el,mood,pos:s.pos||'C'};SND.play('enter')}
      else{ if(s.pos&&s.pos!==cur.pos){cur.pos=s.pos;cur.el.style.left=this.POS[s.pos]}
        if(mood!==cur.mood){cur.mood=mood;cur.el.innerHTML=charSVG(id,mood,s)} }
      if(s.flip)cur.el.style.scale='-1 1';
    }
    await sleep(120);
  },
  mood(id,mood){const cur=this.cast[id];if(cur&&mood&&mood!==cur.mood){cur.mood=mood;cur.el.innerHTML=charSVG(id,mood,{})}},
  flash(){const f=$('#flash');f.classList.remove('go');void f.offsetWidth;f.classList.add('go')},
  async card(c,tk){
    this.hideDlg();const ov=h('div.overlay.daycard',{html:`${this.i===0&&this.lvl?`<div class="lvlpill">LEVEL ${this.lvl.n} · ${esc(this.lvl.title.toUpperCase())}</div>`:''}<div class="day">${esc(c.day||'')}</div>${c.time?`<div class="time">${esc(c.time)}</div>`:''}${c.sub?`<div class="sub">${rich(c.sub)}</div>`:''}<div class="hint2">click to continue</div>`});
    ov.addEventListener('click',()=>this.advance());$('#sframe').appendChild(ov);SND.play('tada');this.clearCast();$('#hots').innerHTML='';
    await this.wait(ov,true);ov.remove();
  },
  /* ---- dialogue ---- */
  hideDlg(){const d=$('#dlg');d.hidden=true;$('#dlgtools').hidden=true},
  async say(b,tk){
    const d=$('#dlg');d.hidden=false;$('#dlgtools').hidden=false;
    const text=(b.t??b.narr??b.say);const who=b.who||(b.narr!==undefined||b.say!==undefined?'narr':'narr');
    const ch=CHARS[who]||CHARS.narr;
    const name=who==='you'?(G.name||'You'):ch.name;
    d.classList.toggle('narration',who==='narr');d.classList.toggle('thought',!!b.thought);
    $('#dlgName').textContent=name;d.style.setProperty('--nc',ch.color);
    const tx=$('#dlgTxt');tx.className='txt'+(who==='narr'?' narr':'');
    if(b.mood)this.mood(who,b.mood);
    for(const id in this.cast)this.cast[id].el.classList.toggle('dim',who!=='narr'&&who!=='you'&&id!==who);
    for(const id in this.cast)this.cast[id].el.classList.toggle('talk',id===who);
    const html=rich(String(text).replace(/\{\{you\}\}/g,esc(G.name||'Researcher')));
    this.hist.push({who:name,color:ch.color,html});if(this.hist.length>300)this.hist.shift();
    const key=this.lvlIdx+':'+this.i;const seen=!!G.seen[key];
    $('#dlgMore').hidden=true;
    $('#srLive').textContent=(name?name+': ':'')+html.replace(/<[^>]+>/g,'');
    await this.type(tx,html,who,seen);
    if(tk!==this.token)return;
    G.seen[key]=1;
    for(const id in this.cast)this.cast[id].el.classList.remove('talk');
    $('#dlgMore').hidden=false;
    await this.wait(null,false,html.length);
    $('#dlgMore').hidden=true;
  },
  type(tx,html,who,seen){
    return new Promise(res=>{
      const sp=(this.skip&&seen)?0:this.speed();
      tx.innerHTML=html;
      if(!sp||reduceMotion()){this.typing=null;return res()}
      // reveal text nodes one character at a time, keeping tags intact
      const nodes=[];const tw=document.createTreeWalker(tx,NodeFilter.SHOW_TEXT);let n;while((n=tw.nextNode()))nodes.push([n,n.nodeValue]);
      nodes.forEach(([n])=>n.nodeValue='');
      // lock the final height so the box does not jump while typing
      const hgt=tx.scrollHeight;tx.style.minHeight=hgt+'px';
      let ni=0,ci=0,cnt=0,stop=false,timer=null;
      const finish=()=>{clearTimeout(timer);nodes.forEach(([n,t])=>n.nodeValue=t);tx.style.minHeight='';this.typing=null;res()};
      this.typing={stop:()=>{stop=true;clearTimeout(timer);this.typing=null;tx.style.minHeight='';res()},skip:finish};
      const tick=()=>{if(stop)return;
        if(ni>=nodes.length)return finish();
        const [n,t]=nodes[ni];const step=sp<8?3:1;ci=Math.min(t.length,ci+step);n.nodeValue=t.slice(0,ci);cnt+=step;if(cnt%3===0)SND.blip(who);
        if(ci>=t.length){ni++;ci=0}
        const ch=t[ci-1];timer=setTimeout(tick,sp*(/[.!?]/.test(ch)?9:/[,;:]/.test(ch)?4:1));};
      tick();
    });
  },
  /* wait for a click / key. In skip mode on seen lines or in auto mode it continues by itself. */
  wait(node,force,len=0){
    return new Promise(res=>{
      let t=null,done=false;
      const go=()=>{if(done)return;done=true;clearTimeout(t);if(this.waiter&&this.waiter.res===go)this.waiter=null;res()};
      this.waiter={res:go,node};
      if(!force){
        const key=this.lvlIdx+':'+this.i;
        if(this.skip&&G.seen[key])t=setTimeout(go,45);
        else if(this.auto)t=setTimeout(go,900+len*14);
      }
    });
  },
  advance(){
    if(Win.current)return;
    if(this.typing){this.typing.skip();return}
    if(this.waiter){const w=this.waiter;SND.play('click');w.res()}
  },
  /* ---- choices ---- */
  async choice(c,tk){
    this.auto=false;this.skip=false;UI.paintToggles();
    const box=$('#choices');box.innerHTML='';box.hidden=false;
    if(c.prompt){const d=$('#dlg');d.hidden=false}
    return new Promise(res=>{
      const finish=async(o)=>{box.hidden=true;box.innerHTML='';if(o.set)Object.assign(G.flags,o.set);SND.play('ok');
        if(o.echo)await this.say({who:'you',t:o.echo},tk);
        if(o.then){const r=await this.run(o.then,0,tk,false);if(r&&r.go!==undefined)return res(r)}
        res(o.go?{go:o.go}:undefined)};
      c.opts.forEach((o,k)=>{box.appendChild(h('button.btn',{type:'button',onclick:()=>finish(o)},h('span.k',String(k+1)),o.t))});
      this.waiter={res:()=>{},node:box,choiceKeys:c.opts.map((o,k)=>()=>finish(o))};
    });
  },
  /* ---- quick quiz ---- */
  async ask(q,tk){
    this.auto=false;this.skip=false;UI.paintToggles();this.hideDlg();
    return new Promise(res=>{
      const card=h('div.quizcard',h('div.qh','QUICK CHECK'),h('div.q',{html:rich(q.q)}));
      const opts=h('div.opts');card.appendChild(opts);const fb=h('div.fb');fb.hidden=true;card.appendChild(fb);
      let tries=0,solved=false;
      const next=h('button.btn.small',{type:'button',hidden:true,onclick:()=>{card.remove();this.hideDlg();res()}},'Got it ▶');
      const order=q.opts.map((o,i)=>i);if(q.shuffle!==false)order.sort(()=>Math.random()-.5);
      order.forEach(i=>{const o=q.opts[i];const b=h('button.opt',{type:'button',html:rich(o.t),onclick:()=>{
        if(solved)return;tries++;
        if(o.ok){solved=true;b.classList.add('right');SND.play('ok');if(tries===1)this.quiz.r++;this.quiz.t++;G.quiz[this.lvl.id]={r:this.quiz.r,t:this.quiz.t};save();
          fb.hidden=false;fb.innerHTML='<b>Yes.</b> '+rich(o.why||q.why||'');next.hidden=false;next.focus();$$('.opt',opts).forEach(x=>x.disabled=true)}
        else{b.classList.add('wrong');b.disabled=true;SND.play('no');fb.hidden=false;fb.innerHTML='<b>Not quite.</b> '+rich(o.why||'Try another answer.')}}});opts.appendChild(b)});
      card.appendChild(next);$('#sframe').appendChild(card);
      this.waiter={res:()=>{},node:card};
    });
  },
  /* ---- hotspots: point-and-click exploring ---- */
  async hot(c,tk){
    this.auto=false;this.skip=false;UI.paintToggles();
    const keys=Object.keys(c.items);const done={};let count=0;const need=c.need||keys.length;
    this.paintHots(keys,done);
    const d=$('#dlg');d.hidden=false;$('#dlgName').textContent='';$('#dlgTxt').className='txt narr';
    const status=()=>{$('#dlgTxt').innerHTML=`<b>Point and click.</b> ${rich(c.prompt||'Poke around the room.')} <span class="mono">(${count} of ${need})</span>`;$('#dlgMore').hidden=true};
    status();
    return new Promise(res=>{
      let busy=false,finished=false;
      const onclick=async e=>{
        const btn=e.target.closest('.hot');if(!btn||busy||finished)return;e.stopPropagation();
        const k=btn.dataset.k;busy=true;SND.play('pop');
        for(const id in this.cast)this.cast[id].el.classList.remove('dim');
        if(!done[k]){done[k]=1;count++;btn.classList.add('done')}
        $('#hots').style.pointerEvents='none';
        await this.run(c.items[k],0,tk,false);
        if(tk!==this.token)return;
        $('#hots').style.pointerEvents='';busy=false;
        if(count>=need){finished=true;$('#hots').removeEventListener('click',onclick);$('#hots').innerHTML='';
          if(c.after){await this.run(c.after,0,tk,false)}
          res();return}
        status();
      };
      $('#hots').addEventListener('click',onclick);this.hotHandler=onclick;
      this.waiter={res:()=>{},node:$('#hots'),hotskip:()=>{finished=true;$('#hots').removeEventListener('click',onclick);$('#hots').innerHTML='';res()}};
    });
  },
  async cert(tk){
    this.hideDlg();$('#hots').innerHTML='';this.clearCast();
    const n=Object.keys(G.stickers).length;const stars=Object.values(G.stars).reduce((a,b)=>a+b,0);
    const ov=h('div.overlay.lvlcomplete',{style:{zIndex:36}},h('div.cert',h('div.cs','HOLLIS HALL LAW LIBRARY'),h('h2','CERTIFICATE'),h('p','of completion, awarded to'),h('div.nm',G.name||'Researcher'),
      h('p',{html:'for a week of research that opened every layer of the machine: tokens, embeddings, attention, pretraining, scaling, sampling, tuning, prompting, retrieval and agents, and for finding the edge where it fails.'}),
      h('div.row',{style:{justifyContent:'center'}},h('span.stamp.good',`${n} OF ${STICKERS.length} STICKERS`),h('span.stamp.good',`${stars} STARS`)),
      h('button.btn.pink',{type:'button',onclick:()=>{ov.remove();VN.advance()}},'Frame it ▶')));
    $('#sframe').appendChild(ov);SND.play('tada');
    await new Promise(res=>{this.waiter={res:()=>{ov.remove();res()},node:ov}});
  },
  /* ---- end of level ---- */
  async end(e,tk){
    const L=this.lvl;this.hideDlg();
    const t=this.quiz.t,r=this.quiz.r;const frac=t?r/t:1;const stars=frac>=.8?3:frac>=.5?2:1;
    G.done[L.id]=1;G.stars[L.id]=Math.max(G.stars[L.id]||0,stars);G.lvl=Math.min(this.lvlIdx+1,LEVELS.length-1);G.beat=0;save();
    if(L.sticker)award(L.sticker);(e.stickers||[]).forEach(award);
    UI.paintPalette();UI.paintToolbox();
    if(Object.keys(G.done).length>=LEVELS.length)award('explorer');
    SND.play('tada');
    const ov=h('div.overlay.lvlcomplete');const conf=h('div.confetti');
    if(!reduceMotion())for(let i=0;i<40;i++){const c=h('i');c.style.cssText=`left:${rnd(0,100)}%;background:${pick(Object.values({a:C.pink,b:C.lemon,c:C.lime,d:C.sky,e:C.grape,f:C.tang}))};animation-duration:${rnd(1.6,3.2)}s;animation-delay:${rnd(0,.8)}s`;conf.appendChild(c)}
    const got=(L.sticker?[L.sticker]:[]).concat(e.stickers||[]).map(k=>STK[k]).filter(Boolean);
    const nextL=LEVELS[this.lvlIdx+1];
    const card=h('div.lvlcard',h('h2',this.lvlIdx===LEVELS.length-1?'YOU DID IT!':'LEVEL COMPLETE!'),
      h('div.stars',{'aria-label':stars+' of 3 stars'},[1,2,3].map(n=>h('span',{class:n<=stars?'':'off'},'★'))),
      h('p',`${esc(L.title)}${t?` · ${r} of ${t} quick checks right on the first try`:''}`),
      got.length?h('div.earned',got.map(s=>h('div.stk',{html:s.svg+'<span>'+esc(s.name)+'</span>'}))):null,
      e.learned?h('div.learned',h('b','WHAT YOU PICKED UP'),h('ul',e.learned.map(x=>h('li',{html:rich(x)})))):null,
      h('div.row',{style:{justifyContent:'center'}},
        h('button.btn.lemon',{type:'button',onclick:()=>{ov.remove();conf.remove();UI.openHub()}},'Hollis Hall map'),
        nextL?h('button.btn.pink.big',{type:'button',onclick:()=>{ov.remove();conf.remove();VN.start(this.lvlIdx+1)}},'Next: '+nextL.title+' ▶'):h('button.btn.pink.big',{type:'button',onclick:()=>{ov.remove();conf.remove();UI.showTitle()}},'Back to title')));
    ov.appendChild(card);$('#sframe').append(ov,conf);
    this.waiter={res:()=>{},node:ov};
    await new Promise(()=>{});
  }
};
/* stickers */
function award(id){
  const s=STK[id];if(!s||G.stickers[id])return;G.stickers[id]=Date.now();save();
  toast('Sticker: '+s.name,s.svg);UI.paintToolbox&&UI.paintToolbox();
}
/* input: click on the scene or dialogue, or keys */
document.addEventListener('click',e=>{
  if(!VN.active)return;
  if(e.target.closest('.hot,.choices,.quizcard,.overlay,.vwin,.dlgtools,button,a,input,select,textarea,cite,.term'))return;
  if(e.target.closest('#dlg,#scene,#sframe'))VN.advance();
});
document.addEventListener('keydown',e=>{
  const tag=(e.target.tagName||'').toLowerCase();if(tag==='input'||tag==='textarea'||tag==='select')return;
  if(e.key==='Escape'){if(Win.current){Win.close();e.preventDefault()}return}
  if(!VN.active||Win.current||e.metaKey||e.ctrlKey||e.altKey)return;
  if(VN.waiter&&VN.waiter.choiceKeys&&/^[1-4]$/.test(e.key)){const f=VN.waiter.choiceKeys[+e.key-1];if(f){e.preventDefault();f()}return}
  if(e.target.closest&&e.target.closest('button')&&(e.key==='Enter'||e.key===' '))return;
  if(e.key===' '||e.key==='Enter'||e.key==='ArrowRight'){e.preventDefault();VN.advance()}
  else if(e.key==='l'||e.key==='L')UI.openLog();
  else if(e.key==='a'||e.key==='A'){VN.auto=!VN.auto;UI.paintToggles();if(VN.auto)VN.advance()}
});
