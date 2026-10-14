/* ==== STORY helpers + LEVEL 0: First Day ==== */
const Q=(t,mood='neutral',x)=>Object.assign({who:'quill',mood,t},x);
const PX=(t,mood='neutral',x)=>Object.assign({who:'pixel',mood,t},x);
const WH=(t,mood='stern',x)=>Object.assign({who:'whitlock',mood,t},x);
const DA=(t,mood='happy',x)=>Object.assign({who:'dash',mood,t},x);
const YOU=(t,x)=>Object.assign({who:'you',t},x);
const NAR=(t,x)=>Object.assign({narr:t},x);
const CAST=spec=>({cast:spec});
const FIG=(svg,cap)=>`<figure class="fig">${svg}<figcaption>${cap}</figcaption></figure>`;
const NERD=(title,inner)=>`<details class="nerdbox"><summary><svg viewBox="0 0 30 16" aria-hidden="true"><circle cx="7" cy="8" r="5.5" fill="#fff" stroke="#1a1033" stroke-width="2"/><circle cx="23" cy="8" r="5.5" fill="#fff" stroke="#1a1033" stroke-width="2"/><path d="M12.5 7h5" stroke="#1a1033" stroke-width="2"/></svg>NERD MODE · ${title}</summary><div class="nb">${inner}</div></details>`;
const CB=(cls,head,inner)=>`<div class="cb ${cls}"><b class="h">${head}</b>${inner}</div>`;
const EQ=(inner,cap)=>`<div class="eq">${cap?`<span class="cap">${cap}</span>`:''}${inner}</div>`;
const WHERE=rows=>`<div class="where">${rows.map(([a,b])=>`<div><b>${a}</b><span>${b}</span></div>`).join('')}</div>`;
const FRAC=(a,b)=>`<span class="frac"><span>${a}</span><span>${b}</span></span>`;
const rpage=(...parts)=>parts.join('\n');

BOOK.first={title:'First Day',pages:[
rpage(`<h2><small>LEVEL 0 · FIRST DAY</small>How this game works</h2>`,
`<p class="drop">AI Pix Explorer is a story with a textbook inside it. The story takes place at Hollis Hall Law Library over one working week. The textbook is the book you are reading now. You can open it from the toolbox at any time.</p>`,
`<p>Every level has three parts. A <b>scene</b> where characters talk and you click on things. A <b>chapter</b> like this one, with the full explanation. And a <b>toy</b>, a small machine you can push around with your own hands. You can do them in any order, and you can come back whenever you like.</p>`,
CB('term','KEY TERMS','Words with a dotted underline, like [[token]] or [[embedding]], open a short definition when you click them. The glossary at the back collects them all.'),
CB('lit','FROM THE LITERATURE',`Boxes like this carry what the research papers say. You will see a small gray citation, for example {{c:abumostafa2012}}. Click it for the full APA reference. Every reference also appears at the bottom of its page and in the reference list at the back.`),
CB('everyday','EVERYDAY COMPARISON','Green boxes translate an idea into a kitchen, a party, a shopping trip or a map. They never use law as the comparison. Law shows up in the examples.'),
CB('ml','IN ML TERMS','Blue boxes connect the idea to machine learning you may already know: classifiers, clustering, gradient descent.')),
rpage(`<h2><small>THE ASSIGNMENT</small>The Westmore problem</h2>`,
`<p>Senior Partner Whitlock has a research question. The facts are made up, but the shape of the problem is real.</p>`,
`<p>Rosalind Tolliver is a beneficiary of her late father's trust. The trust contains a <b>no-contest clause</b>: any beneficiary who contests the trust forfeits their share. The trust also promises her "reasonable maintenance," and nobody agrees what that means. She wants to ask a court to explain the term. If the court decides that asking is a contest, she loses everything.`,
`<p>No appellate court in the State of Westmore has decided that exact question. Lawyers call this a <b>question of first impression</b>. With no controlling case, the memo has to look elsewhere: other states that faced the question, model laws and treatises, and the policy reasons a court might accept.</p>`,
CB('warn','FICTION ALERT','The State of Westmore, the Tolliver Trust, every case and every memo in this game are invented. Where the game shows numbers from a simulation, it says <b>simulated</b>. Where it shows numbers from a paper, it cites the paper.'),
`<p>Over five days you will learn how an AI research assistant is built, one layer at a time. On Friday you will see why its first draft is strong on familiar arguments and quiet on the unusual ones, and what to do about it.</p>`),
rpage(`<h2><small>THE BIG PICTURE</small>Three machines, nested like dolls</h2>`,
`<p>When a research tool answers a question, up to three machines are at work. They fit inside one another.</p>`,
`<p>The smallest is the <b>large language model</b> (LLM). It reads text and predicts what comes next {{c:vaswani2017,brown2020}}. Around it sits <b>retrieval</b>, a search step that fetches documents for the model to read before it answers {{c:lewis2020}}. Around that sits the <b>agent loop</b>: ordinary software that lets the model call tools, read what came back, and decide what to do next {{c:kang2026}}.</p>`,
FIG(`<svg viewBox="0 0 400 230" role="img" aria-label="Three nested boxes: agent loop contains retrieval contains LLM"><rect x="6" y="6" width="388" height="218" rx="22" fill="#ffe2c6" stroke="#1a1033" stroke-width="4"/><text x="22" y="34" font-family="Bungee" font-size="15">AGENT LOOP</text><rect x="40" y="48" width="320" height="162" rx="18" fill="#e6dbff" stroke="#1a1033" stroke-width="4"/><text x="56" y="76" font-family="Bungee" font-size="15">RETRIEVAL (RAG)</text><rect x="80" y="92" width="240" height="100" rx="14" fill="#d4e7ff" stroke="#1a1033" stroke-width="4"/><text x="200" y="130" text-anchor="middle" font-family="Bungee" font-size="20">LLM</text><text x="200" y="158" text-anchor="middle" font-family="Comic Neue" font-size="14" font-weight="700">predicts the next token</text></svg>`,'<b>Figure 1.</b> The three machines, smallest inside.'),
CB('everyday','EVERYDAY COMPARISON','The LLM is the cook\'s trained instincts. Retrieval is the cookbook laid open on the counter. The agent loop is the cook plus a runner who can fetch things and a phone to call suppliers.'),
CB('ml','IN ML TERMS','An LLM is a classifier trained by gradient descent. The label for each training example is simply the next token in real text, so the data labels itself. The classes are the roughly 100,000 tokens in its vocabulary.'),
`<p>The levels follow the dolls from the inside out. Levels 2 to 9 build the LLM. Level 10 adds retrieval. Levels 11 and 12 add the agent loop. Level 13 shows where the whole stack runs out of road.</p>`)
]};

LEVELS.push({id:'first',n:0,day:'Monday',title:'First Day',scene:'lobby',music:'hub',toy:'map',sticker:'firstday',
 blurb:'Meet the library, the people, the problem and the three nested machines.',
 script:()=>[
 {card:{day:'MONDAY',time:'8:55 AM',sub:'Hollis Hall Law Library. Your first day on the job.'}},
 {bg:'lobby',music:'hub',cast:{}},
 NAR('The sign on the door says HOLLIS HALL LAW LIBRARY. Inside it smells like old paper and fresh coffee. You are the new research fellow, and you are five minutes early.'),
 CAST({quill:{pos:'ML',mood:'happy'}}),
 Q('There you are, {{you}}! I\'m Dr. Quill. I run research services here. Welcome to the only law library in the state with a card catalog and, as of last week, a robot.','happy'),
 {choice:{opts:[{t:'A robot?',go:'robot'},{t:'Nice to meet you, Dr. Quill.',go:'nice'}]}},
 {label:'nice'},
 Q('Please, just Quill. And hold your questions about the robot for about thirty seconds.','laugh'),
 {go:'tour'},
 {label:'robot'},
 Q('A robot. Well, a program with a face. You will meet Pixel in a minute. First, look around. This library is point and click.','happy'),
 {label:'tour'},
 {hot:{prompt:'Click the things that sparkle. Find two.',need:2,items:{
   cabinet:[NAR('Wooden drawers, each stuffed with index cards. One card per book. You pull a card, it tells you where the book sits.'),Q('Every card points at exactly one thing. Keep that picture handy. A search system for AI works on the same idea, only the cards are made of numbers.','think')],
   clock:[Q('Nine o\'clock. And that, {{you}}, is the last relaxed moment you will have until Friday at five.','worried')],
   mug:[NAR('The mug says WORLD\'S OKAYEST LIBRARIAN. It is still warm.'),Q('Do not touch the mug.','stern')],
   shelves:[NAR('Reporters, treatises, bound volumes of statutes. More text than anyone could read in ten lifetimes.'),Q('Hold that thought. Pixel has read more than all of these shelves put together. That is exactly why we need to understand how it works.','think')],
   plant:[NAR('A fern the size of a small car. A tag on the pot says MR. BLUEBOOK.'),Q('Mr. Bluebook has been here longer than I have. He takes up no context window and gives no legal advice. I admire that.','laugh')]}}},
 Q('Good eye. Now, business.','neutral'),
 CAST({whitlock:{pos:'R',mood:'stern'}}),
 WH('Quill. Is this the new fellow? Good. Listen closely, because I will say this once.'),
 WH('Our client is Rosalind Tolliver. Her late father\'s trust says any beneficiary who contests the trust loses their share. That is a no-contest clause.'),
 WH('The trust also promises her "reasonable maintenance." Nobody knows what that means. She wants the court to construe the term. If a judge decides that asking is a contest, she forfeits everything.','worried'),
 NAR('Everything in this story is fictional: the State of Westmore, the Tolliver Trust, every case and every memo. The ideas are real. The names are made up.'),
 WH('No appellate court in Westmore has decided whether a petition to construe counts as a contest. I need a memo with every argument we have. Friday, five o\'clock.'),
 Q('You will have it.','proud'),
 WH('Use the new system if you like. Check everything it gives you.','stern'),
 CAST({whitlock:null}),
 Q('That is Whitlock. Terrifying and fair. Now, the new system.','laugh'),
 CAST({pixel:{pos:'R',mood:'sleepy'}}),
 PX('zzz... booting... loading 175,000,000,000 parameters... zzz...','sleepy'),
 {wait:500},
 PX('HELLO! I am Pixel! I have read nearly everything! Ask me anything!','excited'),
 Q('Pixel is a large language model wrapped in a friendly program. It writes fast and sounds sure. That is the delight and the danger.','neutral'),
 PX('I resent "danger."','sad'),
 Q('This week we open the hood, one layer a day. By Friday you will know why Pixel\'s first draft will be good, and exactly where it will quietly leave something out.','happy'),
 PX('I will not leave anything out!','smug'),
 Q('We will see.','wink'),
 Q('You get two tools. A textbook for the full explanations, and a toolbox of toys. Let\'s open the book to the first chapter.','happy'),
 {book:'first',at:0,note:'Read the three pages, then press "Back to the story".'},
 Q('Back already? Good. See the toolbox on the left? Everything in it is a toy you can play with at any time. Let\'s start with the biggest picture there is.','happy'),
 {toy:'map',goals:[{text:'Press "Trace a question" at least 3 times',on:'click',sel:'#traceNext',n:3}],note:'Follow one question through the machine.'},
 Q('That is the whole system on one page. Now a check. Pixel is going to be nervous.','laugh'),
 {ask:{q:'Of the three nested machines, which one is the smallest, the innermost doll?',opts:[
   {t:'The language model (LLM)',ok:true,why:'The LLM sits at the center. Retrieval and the agent loop are built around it.'},
   {t:'Retrieval (RAG)',why:'Retrieval wraps around the LLM. It fetches documents for the model to read.'},
   {t:'The agent loop',why:'The agent loop is the outermost doll. It lets the model use tools and repeat.'}]}},
 PX('The smallest? Me?','sad'),
 Q('The innermost. Everything else is built around you.','happy'),
 PX('I feel so seen.','proud'),
 Q('Tomorrow we go inside Pixel. Today, one more thing: the history. These ideas are older than you think.','think'),
 {end:{learned:['A language model, retrieval and an agent loop nest like dolls.','The assignment: a memo on a first-impression no-contest question by Friday.','Every case and number in this game is labeled fictional or simulated.']}}
]});
