/* ==== LEVEL 12: The Big Run (the 3D agent run) ==== */
BOOK.run3d={title:'The Big Run',pages:[
rpage(`<h2><small>LEVEL 12 · THE BIG RUN</small>One agent job, token by token</h2>`,
`<p class="drop">The <b>3D Run</b> toy follows a complete agent job, "build me a calculator in python," one token at a time. Every idea from the week shows up in it. Tokens land on the desk. Attention pulls information from earlier tokens. The model scores the vocabulary. One token is picked. Between turns, the agent loop runs tools {{c:vaswani2017,kang2026}}.</p>`,
CB('warn','SIMULATED NUMBERS','The tokens follow a written script of what a coding agent would plausibly produce. The probabilities and attention weights come from simple rules built to behave like a real model: copying earlier tokens, recency, an attention sink on the first token, near-certain syntax. A real model\'s numbers would differ, and its attention is spread across dozens of heads and layers.')),
rpage(`<h2><small>HOW TO READ THE SCENE</small>Floor, height, beams</h2>`,
`<ul><li><b>The floor</b> is a meaning map like the one in Level 3, with neighborhoods for English words, Python keywords, names, operators, punctuation and tool syntax. Every token already in the context sits on the floor at its spot, and tokens that appear many times pile into little towers.</li><li><b>Height is probability.</b> At each step a glowing hill rises over the part of the map where the next token is likely to come from. A tall narrow spike means the model is nearly certain: after <code>def add(a,</code> the next token is almost surely <code>b</code>. A low, wide hill means many reasonable options, like the first word of a reply.</li><li><b>Pink beams</b> rise from the tokens the model is attending to most and meet in the gold sphere, the working vector for this step. A thicker beam means a bigger share of attention.</li></ul>`,
CB('everyday','EVERYDAY COMPARISON','A rainfall map where height is how likely rain is at each spot. A thunderstorm over one town is a spike. A drizzle everywhere is a low, wide hill.')),
rpage(`<h2><small>WHAT TO WATCH FOR</small>Three moments</h2>`,
`<p><b>The first tool call.</b> At the first <code>⟨call⟩</code> token the model chooses to call a tool instead of answering in chat. That is the moment a chatbot becomes an agent.</p><p><b>The failed test.</b> When the test runner reports a failure, the error tokens immediately get the strongest beams. The model uses what the tool returned.</p><p><b>The fix.</b> The model proposes a small edit, the harness applies it, the tests run again, and the run ends with a plain-language answer.</p>`,
CB('try','TRY IT','Drag to orbit, scroll to zoom, and use <b>Top</b> view to flatten the hill into a 2-D heatmap. Move the temperature slider and watch the hill change.<br><button class="btn small lemon" type="button" data-toy="run3d">Open the toy</button>'),
NERD('one step, end to end',EQ(`<b>z</b> = <b>h</b><sub><i>t</i></sub><sup>(<i>L</i>)</sup> <i>W</i><sub><i>U</i></sub>, &nbsp; <i>p</i>(<i>v</i>) = ${FRAC('exp(<i>z</i><sub><i>v</i></sub> / <i>T</i>)','<span class="big">Σ</span><sub><i>u</i></sub> exp(<i>z</i><sub><i>u</i></sub> / <i>T</i>)')}`,'Score every vocabulary token, then softmax. These are the bars in the scene.')+EQ(`<b>h</b><sub><i>t</i></sub> ← <span class="big">Σ</span><sub><i>j</i> ≤ <i>t</i></sub> <i>a</i><sub><i>tj</i></sub> <b>v</b><sub><i>j</i></sub>`,'The beams are one row of attention weights, a<sub>tj</sub>.'))),
rpage(`<h2><small>REVIEW</small>Level 12 in a nutshell</h2>`,
`<ul><li>An agent run is many token predictions, with tool calls between turns.</li><li>Height is next-token probability. Beams show attention. The floor is the meaning map.</li><li>These numbers are simulated. The mechanisms they illustrate are real.</li></ul>`,
`<p>You now have the whole machine. The last level asks what it cannot do.</p>`)
]};

LEVELS.push({id:'run3d',n:12,day:'Friday',title:'The Big Run',scene:'lab',music:'lab',toy:'run3d',sticker:null,
 blurb:'A whole agent job in 3D, token by token: attention, probability, tool calls and the loop.',
 script:()=>[
 {card:{day:'FRIDAY',time:'11:30 AM',sub:'Back in the lab. The big screen is warming up.'}},
 {bg:'lab',music:'lab',cast:{}},
 CAST({quill:{pos:'ML',mood:'happy'},pixel:{pos:'R',mood:'excited'}}),
 Q('Everything we learned this week, in one scene. A real agent job, run one token at a time. Pixel will build a small calculator in Python.','happy'),
 PX('I like this job. There are no case names in it.','happy'),
 {hot:{prompt:'Check out the lab before we start. Find two things.',need:2,items:{
   monitors:[NAR('The monitors show a wall of tiny probabilities. One says p = 0.42. The LOADING one has finally finished loading.'),PX('...it says "hello." Thirty years. Worth it.','proud')],
   rack:[NAR('The rack hums. The pink LED flickers each time a token comes out.'),Q('That flicker is the model running once per token. Remember the 400 rolls for a 300-word answer?','happy')],
   board:[NAR('The chalkboard has a new drawing: a tower of tokens on a map, a pink beam, a golden ball.'),Q('Your cheat sheet for the scene. Tokens on the floor. Height is probability. Pink beams show attention.','neutral')],
   cork:[NAR('The sticky notes now have little arrows between them.'),Q('Tokens to embeddings to attention to dice to RAG to agents. That red string is the whole week.','wink')]}}},
 Q('The floor is a meaning map, like Tuesday morning. Every token already in the context sits on it, and a hill rises over where the next token will probably come from. Tall and narrow means near certain. Low and wide means many options.','think'),
 Q('The pink beams are attention. They rise from the earlier tokens the model leans on most and meet in a golden sphere, the working vector for this step.','neutral'),
 {toy:'run3d',goals:[{text:'Step forward 8 tokens',on:'click',sel:'#r3Next',n:8},{text:'Switch to the Top view',on:'click',sel:'#r3View button[data-v="top"]',n:1},{text:'Jump to the next phase',on:'click',sel:'#r3PhNext',n:1}],note:'Simulated numbers, built to behave like a real model.'},
 Q('Find the first call token. It is the moment Pixel stops chatting and starts acting. The hill changes shape. A tool is about to run, and the harness takes over.','happy'),
 Q('Then look at the test failure. The error tokens suddenly draw the strongest beams. The model uses what the tool told it, and writes the fix.','think'),
 PX('I notice I am quite certain about the colons.','proud'),
 Q('Python syntax is very regular, so the spikes are tall. A reply to a human is a far more open question. Low, wide hills.','neutral'),
 {ask:{q:'In the 3D scene, what does the height of the glowing hill over the floor represent?',opts:[
   {t:'How likely the model thinks each region of tokens is to come next',ok:true,why:'Height is probability of the next token. A tall narrow spike means near certainty.'},
   {t:'How many tokens have been used so far',why:'The token count shows elsewhere. Height is probability.'},
   {t:'How long each tool takes to run',why:'The scene does not measure time. Height is next-token probability.'}]}},
 {ask:{q:'These probabilities and attention weights in the 3D run are:',opts:[
   {t:'Simulated by simple rules that behave like a real model, not copied from one',ok:true,why:'The scene says so. The numbers illustrate the mechanisms. A real model\'s numbers would differ.'},
   {t:'Measured from a real production model',why:'They are not. The toy labels them simulated.'},
   {t:'Random numbers with no pattern',why:'They follow rules: copying, recency, near-certain syntax and an attention sink.'}]}},
 Q('That is the whole machine. Now we have to ask the last question. What can it not do?','stern'),
 {end:{learned:['Every agent run is many token predictions with tool calls between turns.','Height is next-token probability. Beams show attention. The floor is the meaning map.','The scene\'s numbers are simulated. The mechanisms they show are real.'],stickers:['cube']}}
]});
