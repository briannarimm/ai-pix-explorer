/* ==== ART: toolbox icons (40 x 40) and sticker badges (80 x 80) ==== */
const I=(inner)=>`<svg viewBox="0 0 40 40" aria-hidden="true">${inner}</svg>`;
const ic=(d,f='none',w=2.5)=>`<path d="${d}" fill="${f}" stroke="#1a1033" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const ICONS={
  book:I(ic('M4 8 q8 -3 16 2 v24 q-8 -5 -16 -2z','#fff')+ic('M36 8 q-8 -3 -16 2 v24 q8 -5 16 -2z','#ffd92e')+ic('M8 14 q5 -1 8 1 M8 19 q5 -1 8 1 M24 15 q4 -2 8 -1 M24 20 q4 -2 8 -1','none',1.8)),
  sysmap:I(`<rect x="3" y="5" width="13" height="10" rx="2" fill="#fff" stroke="#1a1033" stroke-width="2.5"/><rect x="24" y="5" width="13" height="10" rx="2" fill="#ff2d95" stroke="#1a1033" stroke-width="2.5"/><rect x="13" y="26" width="14" height="10" rx="2" fill="#2f8cff" stroke="#1a1033" stroke-width="2.5"/><path d="M16 10h8M10 15l8 11M30 15l-8 11" stroke="#1a1033" stroke-width="2.5" fill="none"/>`),
  hub:I(ic('M4 8 h32 v24 h-32z','#fff')+ic('M4 18 h14 v14 M18 8 v10 M26 18 h10 M26 18 v14','none',2)+`<circle cx="31" cy="12" r="3.5" fill="#ff2d95" stroke="#1a1033" stroke-width="2"/>`+`<circle cx="11" cy="25" r="3.5" fill="#36d65a" stroke="#1a1033" stroke-width="2"/>`),
  time:I(`<circle cx="22" cy="21" r="13" fill="#fff" stroke="#1a1033" stroke-width="2.5"/>`+ic('M22 12 v9 l6 4','none',2.5)+ic('M5 12 l-1 8 l8 -1','none',2.5)+ic('M4.5 19 a17 17 0 0 1 8 -12','none',2.5)),
  neuron:I(`<circle cx="28" cy="20" r="9" fill="#ffd92e" stroke="#1a1033" stroke-width="2.5"/>`+ic('M3 10 h16 M3 20 h16 M3 30 h16 M37 20 h2','none',2.5)+`<text x="28" y="25" text-anchor="middle" font-family="Bungee" font-size="13" fill="#1a1033">θ</text>`),
  tuner:I(ic('M7 6 v28 M20 6 v28 M33 6 v28','none',2.5)+`<rect x="2" y="10" width="10" height="7" rx="2" fill="#ff2d95" stroke="#1a1033" stroke-width="2.2"/><rect x="15" y="22" width="10" height="7" rx="2" fill="#2f8cff" stroke="#1a1033" stroke-width="2.2"/><rect x="28" y="13" width="10" height="7" rx="2" fill="#36d65a" stroke="#1a1033" stroke-width="2.2"/>`),
  cracker:I(`<rect x="8" y="17" width="24" height="17" rx="3" fill="#ffd92e" stroke="#1a1033" stroke-width="2.5"/>`+ic('M13 17 v-5 a7 7 0 0 1 14 0 v5','none',2.5)+`<circle cx="20" cy="25" r="2.5" fill="#1a1033"/>`+ic('M20 27 v4','none',2.5)),
  tokens:I(`<rect x="2" y="12" width="11" height="14" rx="2" fill="#ffd92e" stroke="#1a1033" stroke-width="2.5"/><rect x="15" y="12" width="9" height="14" rx="2" fill="#fff" stroke="#1a1033" stroke-width="2.5"/><rect x="26" y="12" width="12" height="14" rx="2" fill="#36d65a" stroke="#1a1033" stroke-width="2.5"/>`),
  embeddings:I(`<circle cx="10" cy="11" r="4" fill="#ff2d95" stroke="#1a1033" stroke-width="2"/><circle cx="16" cy="15" r="4" fill="#ff2d95" stroke="#1a1033" stroke-width="2"/><circle cx="29" cy="27" r="4" fill="#2f8cff" stroke="#1a1033" stroke-width="2"/><circle cx="24" cy="31" r="4" fill="#2f8cff" stroke="#1a1033" stroke-width="2"/><circle cx="31" cy="10" r="4" fill="#ffd92e" stroke="#1a1033" stroke-width="2"/>`),
  attention:I(ic('M6 30 Q14 6 22 30','none',3)+`<path d="M14 30 Q24 12 34 30" fill="none" stroke="#ff2d95" stroke-width="3"/><rect x="2" y="29" width="36" height="6" rx="2" fill="#fff" stroke="#1a1033" stroke-width="2.5"/>`),
  heads:I(ic('M5 31 Q11 8 17 31','none',2.6)+`<path d="M13 31 Q21 14 29 31" fill="none" stroke="#ff2d95" stroke-width="2.8"/><path d="M21 31 Q29 6 37 31" fill="none" stroke="#2f8cff" stroke-width="2.8"/><rect x="2" y="30" width="36" height="6" rx="2" fill="#fff" stroke="#1a1033" stroke-width="2.3"/>`),
  mask:I(`<rect x="3" y="11" width="34" height="18" rx="4" fill="#fff" stroke="#1a1033" stroke-width="2.5"/>`+`<rect x="14" y="14" width="12" height="12" rx="2" fill="#ffd92e" stroke="#1a1033" stroke-width="2"/><text x="20" y="24" text-anchor="middle" font-family="Bungee" font-size="11" fill="#1a1033">?</text><path d="M6 20 h6 M28 20 h6" stroke="#1a1033" stroke-width="2.5" stroke-linecap="round"/>`),
  scaling:I(`<rect x="4" y="24" width="8" height="12" rx="1.5" fill="#ff8a1f" stroke="#1a1033" stroke-width="2.2"/><rect x="16" y="16" width="8" height="20" rx="1.5" fill="#ff2d95" stroke="#1a1033" stroke-width="2.2"/><rect x="28" y="6" width="8" height="30" rx="1.5" fill="#8b4dff" stroke="#1a1033" stroke-width="2.2"/>`),
  dice:I(`<rect x="6" y="6" width="28" height="28" rx="6" fill="#fff" stroke="#1a1033" stroke-width="3"/><circle cx="14" cy="14" r="3" fill="#1a1033"/><circle cx="20" cy="20" r="3" fill="#1a1033"/><circle cx="26" cy="26" r="3" fill="#1a1033"/>`),
  prefs:I(`<path d="M3 6 h20 a3 3 0 0 1 3 3 v10 a3 3 0 0 1 -3 3 h-12 l-6 5 v-5 h-2 a3 3 0 0 1 -3 -3 v-10 a3 3 0 0 1 3 -3z" fill="#d2f7da" stroke="#1a1033" stroke-width="2.3"/><path d="M14 10 v8 M10 14 h8" stroke="#1a1033" stroke-width="2.3" stroke-linecap="round" opacity="0"/><path d="M8 14 l3 3 l6 -7" fill="none" stroke="#0f8a32" stroke-width="2.8" stroke-linecap="round"/><path d="M17 20 h18 a3 3 0 0 1 3 3 v9 a3 3 0 0 1 -3 3 h-2 v4 l-5 -4 h-11 a3 3 0 0 1 -3 -3 v-9 a3 3 0 0 1 3 -3z" fill="#ffd6e3" stroke="#1a1033" stroke-width="2.3" transform="translate(-2 -6) scale(.95)"/><path d="M20 24 l8 8 M28 24 l-8 8" stroke="#d4004f" stroke-width="2.8" stroke-linecap="round" transform="translate(-1 -4)"/>`),
  vote:I(`<rect x="6" y="18" width="28" height="18" rx="3" fill="#ffd92e" stroke="#1a1033" stroke-width="2.5"/><rect x="13" y="16" width="14" height="4" rx="1" fill="#1a1033"/>`+ic('M14 4 h12 v13 h-12z','#fff',2.2)+ic('M17 10 l3 3 l5 -6','none',2.4)),
  rag:I(ic('M5 9h13v24H5z','#fff')+ic('M18 9h13v24H18z','#ffd92e')+`<circle cx="29" cy="27" r="6" fill="#fff" stroke="#1a1033" stroke-width="2.5"/>`+ic('M33 31l5 5','none',3.5)),
  agents:I(ic('M20 5a15 15 0 1 1-14 10','none',3.5)+ic('M2 12l4 4 5-5','none',3.5)+`<circle cx="20" cy="20" r="6" fill="#ffd92e" stroke="#1a1033" stroke-width="2.5"/>`),
  run3d:I(ic('M4 28 L20 36 L36 28 L20 20 Z','#fff',2.5)+`<path d="M14 27 V12 M20 30 V6 M26 27 V16" stroke="#ff2d95" stroke-width="4" stroke-linecap="round"/>`),
  limits:I(ic('M20 4 L37 34 H3 Z','#ffd92e',3)+ic('M20 14 V24','none',3.5)+`<circle cx="20" cy="29" r="2.2" fill="#1a1033"/>`),
  nudge:I(`<g stroke="#1a1033" stroke-width="2"><rect x="4" y="4" width="10" height="10" fill="#fff"/><rect x="15" y="4" width="10" height="10" fill="#1a1033"/><rect x="26" y="4" width="10" height="10" fill="#fff"/><rect x="4" y="15" width="10" height="10" fill="#1a1033"/><rect x="15" y="15" width="10" height="10" fill="#fff"/><rect x="26" y="15" width="10" height="10" fill="#1a1033"/><rect x="4" y="26" width="10" height="10" fill="#fff"/><rect x="15" y="26" width="10" height="10" fill="#1a1033"/><rect x="26" y="26" width="10" height="10" fill="#ff2d95"/></g>`),
  stickers:I(`<path d="M20 3 l5 11 l12 1.5 l-9 8 l2.5 12 l-10.5 -6 l-10.5 6 l2.5 -12 l-9 -8 l12 -1.5z" fill="#ffd92e" stroke="#1a1033" stroke-width="2.5" stroke-linejoin="round"/>`),
  gear:I(ic('M20 5 l3 4 l5 -1 l1 5 l5 2 l-2 5 l3 4 l-4 3 l0 5 l-5 0 l-3 4 l-3 -4 l-5 0 l0 -5 l-4 -3 l3 -4 l-2 -5 l5 -2 l1 -5 l5 1z','#d6d2ca',2.5)+`<circle cx="20" cy="22" r="6" fill="#fff" stroke="#1a1033" stroke-width="2.5"/>`),
  abc:I(ic('M7 4h26a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z','#fff')+`<text x="20" y="20" text-anchor="middle" font-family="Bungee" font-size="11" fill="#ff2d95">ABC</text>`+ic('M11 26h18M11 31h12','none',2.2)),
  memo:I(ic('M8 4h20l6 6v26H8z','#fff',2.6)+ic('M28 4v6h6','none',2.4)+ic('M13 16h16M13 22h16M13 28h10','none',2.4)+`<circle cx="29" cy="31" r="5" fill="#ff2d95" stroke="#1a1033" stroke-width="2.2"/>`),
  quill:I(`<path d="M30 5 q-20 2 -22 28 q16 -4 22 -28z" fill="#ffd92e" stroke="#1a1033" stroke-width="2.5" stroke-linejoin="round"/>`+ic('M8 33 l14 -16','none',2.5))
};
/* stickers: tiny badge generator. shape: circle | star | shield | hex */
function badge(shape,bg,glyph,gc='#fff'){
  const base={circle:`<circle cx="40" cy="40" r="34" fill="${bg}" stroke="#1a1033" stroke-width="4"/><circle cx="40" cy="40" r="27" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="3" stroke-dasharray="3 5"/>`,
    star:(()=>{let d='';for(let i=0;i<16;i++){const r=i%2?29:37,a=-Math.PI/2+i*Math.PI/8;d+=(i?'L':'M')+(40+Math.cos(a)*r).toFixed(1)+' '+(40+Math.sin(a)*r).toFixed(1)}return `<path d="${d}Z" fill="${bg}" stroke="#1a1033" stroke-width="4" stroke-linejoin="round"/>`})(),
    shield:`<path d="M12 10 h56 v34 q0 20 -28 28 q-28 -8 -28 -28z" fill="${bg}" stroke="#1a1033" stroke-width="4" stroke-linejoin="round"/><path d="M19 17 h42 v26 q0 14 -21 21" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="3"/>`,
    hex:`<path d="M40 5 L71 22 V58 L40 75 L9 58 V22Z" fill="${bg}" stroke="#1a1033" stroke-width="4" stroke-linejoin="round"/>`}[shape]||'';
  const isTxt=!glyph.startsWith('<');
  const g=isTxt?`<text x="40" y="${glyph.length>3?47:49}" text-anchor="middle" font-family="Bungee, Arial Black, sans-serif" font-size="${glyph.length>4?15:glyph.length>2?20:26}" fill="${gc}" stroke="#1a1033" stroke-width="3" paint-order="stroke">${esc(glyph)}</text>`:glyph;
  return `<svg viewBox="0 0 80 80" xmlns="${NS}" aria-hidden="true">${base}${g}</svg>`;
}
const STICKERS=[
  ['firstday','Badge Day','Finish your first day at Hollis Hall.',badge('shield','#2aa7a0','HI')],
  ['neuron','Neuron','Fire a 1943 McCulloch-Pitts neuron.',badge('circle','#ffd92e','θ','#8b4dff')],
  ['weights','Weight Watcher','Tune the checkers weights until the program wins.',badge('hex','#ff8a1f','Σw')],
  ['cracker','Code Cracker','Crack a cipher by matching letter frequencies.',badge('shield','#8b4dff','χ²')],
  ['tokens','Brick Layer','Chop a sentence into tokens.',badge('hex','#ff2d95','TOK')],
  ['desk','Desk Clearer','Load more pages than the context window can hold.',badge('circle','#2f8cff','n')],
  ['mapmaker','Map Maker','Drop a question onto the meaning map.',badge('star','#36d65a','★','#ffd92e')],
  ['party','Party Animal','Watch "it" find "clause" at the attention party.',badge('star','#ff2d95','Q·K')],
  ['heads','Many Heads','Compare three attention heads.',badge('hex','#ff8a1f','×8')],
  ['blank','Blank Filler','Beat the fill-in-the-blank game.',badge('circle','#2f8cff','[?]')],
  ['bigger','Big and Bigger','Slide the scaling dial to 175 billion.',badge('shield','#8b4dff','175B')],
  ['balance','Balanced Diet','Hit the compute-optimal ratio.',badge('hex','#36d65a','20:1')],
  ['dice','Dice Master','Roll the loaded dice 20 times.',badge('circle','#fff',A.g(A.die(24,24,32,5),''),'#1a1033')],
  ['cool','Cool Customer','Turn the temperature right down.',badge('shield','#2f8cff','T')],
  ['manners','Teacher\'s Pet','Rank answers and train a reward model.',badge('star','#ffd92e','RM','#d4004f')],
  ['reasoner','Show Your Work','Compare a direct answer with a chain of thought.',badge('hex','#ff2d95','1+1')],
  ['majority','Majority Rules','Take a vote across reasoning paths.',badge('circle','#36d65a','✔✔✔')],
  ['openbook','Open Book','Run the RAG pipeline end to end.',badge('shield','#8b4dff','RAG')],
  ['citechecker','Cite Checker','Click a citation to see its source.',badge('circle','#ffd92e','[1]','#1a1033')],
  ['chef','Order Up!','Step through the agent loop.',badge('hex','#ff5a2a','↻')],
  ['citator','Fake Catcher','Let the citator catch a made-up case.',badge('star','#36d65a','404')],
  ['cube','Third Dimension','Ride the 3D run.',badge('hex','#2f8cff','3D')],
  ['edge','Edge Finder','See why novel issues land at the edge.',badge('shield','#ff8a1f','!')],
  ['nudge','Gentle Nudge','Flip a classifier with a small, targeted nudge.',badge('circle','#ff2d95','ε')],
  ['novel','Novel Thinker','Add the attorney review.',badge('star','#ffd92e','IDEA','#1a1033')],
  ['memo','Memo Done','Finish Friday\'s memo.',badge('hex','#2aa7a0','MEMO')],
  ['timetravel','Time Traveler','Visit three eras in the time machine.',badge('circle','#8b4dff','1943')],
  ['reader','Bookworm','Read every page of a chapter.',badge('shield','#ff2d95','ABC')],
  ['nerd','Nerd Mode','Open a Nerd Mode panel.',badge('hex','#2f8cff','∑')],
  ['explorer','Explorer','Finish every level.',badge('star','#ff2d95','ALL','#ffd92e')]
];
const STK=Object.fromEntries(STICKERS.map(s=>[s[0],{id:s[0],name:s[1],how:s[2],svg:s[3]}]));
