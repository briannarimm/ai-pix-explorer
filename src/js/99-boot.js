/* ==== BOOT ==== */
document.body.insertAdjacentHTML('afterbegin',DEFS_SVG);
loadSave();
/* pass 1: create every toy's DOM so ids exist before any init runs. pass 2: wire them up. */
const toyIds=Object.keys(TOYS);
toyIds.forEach(id=>{const T=TOYS[id];const root=h('div.toyroot',{id:'toy-'+id,hidden:true});root.innerHTML=T.html;$('#toyshelf').appendChild(root)});
toyIds.forEach(id=>{const T=TOYS[id];try{if(T.init)T.init($('#toy-'+id))}catch(e){console.error('toy init failed: '+id,e)}});
window.addEventListener('beforeunload',()=>{try{store.set(SAVE_KEY,JSON.stringify(G))}catch(e){}});
UI.buildTitle();

/* a quick 90s boot screen, skipped for automated tests and reduced motion */
(function(){
  if(navigator.webdriver||reduceMotion())return;
  const lines=['AI PIX EXPLORER v2.0  (c) HOLLIS HALL SOFTWARE','Checking memory ........ 640K OK','Loading tokens, maps and dice ...','Warming up Pixel ........ OK','Click anywhere to begin'];
  const box=h('div.boot',{role:'presentation'},h('pre'),h('div.bar',h('i')));document.body.appendChild(box);document.body.classList.add('busy');
  const pre=$('pre',box);let i=0;const bar=$('.bar i',box);
  const t=setInterval(()=>{pre.textContent+=(i?'\n':'')+lines[i];bar.style.width=Math.min(100,(i+1)*22)+'%';i++;if(i>=lines.length){clearInterval(t);bar.style.width='100%';document.body.classList.remove('busy');setTimeout(done,500)}},260);
  const done=()=>{clearInterval(t);document.body.classList.remove('busy');box.classList.add('out');setTimeout(()=>box.remove(),400)};
  box.addEventListener('click',done);
})();
