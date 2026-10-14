/* ==== TOY: 3D Agent Run. Ported from v1 unchanged except for how it is mounted. Do not change its look or behavior. ==== */
TOYS.run3d={title:'3D Agent Run',short:'3D Run',level:12,color:'var(--sky)',tb1:'var(--sky)',tb2:'var(--lime)',icon:ICONS.run3d,
  help:'Drag to orbit. Scroll to zoom. Simulated numbers, built to behave like a real model.',
  html:`      <div class="phasebar" id="phaseBar" aria-label="Jump to a phase of the agent loop"></div>
      <div class="run-grid">
        <div class="canvas" style="display:grid;gap:10px;padding:10px">
          <div class="stage3d" id="stage3d" data-hint="Drag to orbit. Scroll to zoom. Tall spikes = confident; wide hills = many options.">
            <div class="stage-hud"><span id="hud1">x, z: meaning map (2-D projection)</span><span>height: p(next token)</span></div>
          </div>
          <div class="ctl-row">
            <button class="btn pink small" type="button" id="r3PhPrev" data-hint="Jump to the start of the previous phase.">⏮ Phase</button>
            <button class="btn pink" type="button" id="r3Prev" data-hint="Back one token (←).">◀</button>
            <button class="btn" type="button" id="r3Next" data-hint="Forward one token (→).">Next token ▶</button>
            <button class="btn sky small" type="button" id="r3PhNext" data-hint="Skip to the next phase of the agent loop.">Phase ⏭</button>
            <button class="btn grape small" type="button" id="r3Play">Play</button>
            <div class="seg" id="r3Speed" aria-label="Playback speed">
              <button type="button" data-v="1" aria-pressed="true">1×</button>
              <button type="button" data-v="3" aria-pressed="false">3×</button>
              <button type="button" data-v="10" aria-pressed="false">10×</button>
            </div>
          </div>
          <div class="ctl-row">
            <span class="label">View</span>
            <div class="seg" id="r3View">
              <button type="button" data-v="3d" aria-pressed="true">3D</button>
              <button type="button" data-v="top" aria-pressed="false">Top (2-D heatmap)</button>
              <button type="button" data-v="side" aria-pressed="false">Side</button>
            </div>
            <label class="slider-row" style="flex:1;min-width:230px;grid-template-columns:96px minmax(0,1fr) 48px"><span>Temperature</span><input type="range" id="r3T" min="0.1" max="2" step="0.05" value="1"><output id="r3TOut">1.00</output></label>
          </div>
        </div>
        <div class="canvas step-card">
          <div class="step-head"><b id="r3Head">Step 1</b><span class="kchip" id="r3Kind">PROMPT IN</span></div>
          <p id="r3Note" style="font-size:16px"></p>
          <div>
            <span class="label" id="r3CandLbl">Top candidates for the next token</span>
            <div class="cand-tbl" id="r3Cands"></div>
          </div>
          <div class="live" id="r3Live"></div>
        </div>
      </div>
      <div class="two">
        <div class="canvas" style="display:grid;gap:8px;min-width:0">
          <div class="row" style="justify-content:space-between"><span class="label">Context window as a 2-D heatmap</span><span class="tip" id="r3CtxN"></span></div>
          <div class="ctxwin" id="r3Ctx" aria-label="Context window"></div>
          <div class="legend"><span><i style="background:#b9b3c6"></i>system</span><span><i style="background:var(--pink)"></i>you</span><span><i style="background:var(--grape)"></i>model output</span><span><i style="background:var(--sky)"></i>tool result</span><span><i style="background:var(--lemon);border-style:dashed"></i>being predicted</span><span>pink fill = attention weight</span></div>
        </div>
        <div class="canvas" style="display:grid;gap:8px;min-width:0">
          <span class="label">What you see in the chat app</span>
          <div class="chat" id="r3Chat"></div>
        </div>
      </div>
      <div class="nerd">
        <div class="nerd-h"><svg viewBox="0 0 30 16" aria-hidden="true"><circle cx="7" cy="8" r="5.5" fill="#fff" stroke="#1a1033" stroke-width="2"/><circle cx="23" cy="8" r="5.5" fill="#fff" stroke="#1a1033" stroke-width="2"/><path d="M12.5 7h5" stroke="#1a1033" stroke-width="2"/></svg>NERD MODE · one step, end to end</div>
        <div class="nerd-b">
          <div class="eqs">
            <div class="eq"><span class="cap">1 · Tokenize the context and look up vectors</span><b>x</b> = Tok(<i>c</i>), &nbsp;&nbsp; <b>h</b><sub><i>i</i></sub><sup>(0)</sup> = <i>W</i><sub><i>E</i></sub>[<i>x</i><sub><i>i</i></sub>] + PE(<i>i</i>)</div>
            <div class="eq"><span class="cap">2 · <i>L</i> transformer blocks; the beams in the scene are one row of attention weights</span><b>h</b><sub><i>t</i></sub> ← <span class="big">Σ</span><sub><i>j</i> ≤ <i>t</i></sub> <i>a</i><sub><i>tj</i></sub> <b>v</b><sub><i>j</i></sub>, &nbsp;&nbsp; <i>a</i><sub><i>tj</i></sub> = softmax<sub><i>j</i></sub>(<i>s</i><sub><i>tj</i></sub>), &nbsp; <i>s</i><sub><i>tj</i></sub> = <b>q</b><sub><i>t</i></sub>·<b>k</b><sub><i>j</i></sub> / √<i>d</i><sub><i>k</i></sub></div>
            <div class="eq"><span class="cap">3 · Score every vocabulary token, then softmax (the bars)</span><i>p</i>(<i>v</i>) = <span class="frac"><span>exp(<i>z</i><sub><i>v</i></sub> / <i>T</i>)</span><span><span class="big">Σ</span><sub><i>u</i></sub> exp(<i>z</i><sub><i>u</i></sub> / <i>T</i>)</span></span>, &nbsp;&nbsp; <b>z</b> = <b>h</b><sub><i>t</i></sub><sup>(<i>L</i>)</sup> <i>W</i><sub><i>U</i></sub></div>
            <div class="eq"><span class="cap">4 · The glowing surface: a kernel density of probability over the meaning map (like a KDE plot)</span><i>S</i>(<i>u</i>, <i>w</i>) = <span class="big">Σ</span><sub><i>v</i></sub> <i>p</i>(<i>v</i>) · exp<span class="big">(</span>− <span class="frac"><span>‖(<i>u</i>, <i>w</i>) − pos<sub><i>v</i></sub>‖<sup>2</sup></span><span>2<i>σ</i><sup>2</sup></span></span><span class="big">)</span></div>
            <div class="eq"><span class="cap">5 · Sample, append, repeat; the agent loop runs tools between turns</span><i>y</i><sub><i>t</i></sub> ∼ <i>p</i>, &nbsp; <i>c</i> ← <i>c</i> ⊕ <i>y</i><sub><i>t</i></sub> &nbsp;&nbsp; until ⟨/call⟩ ⟹ <i>c</i> ← <i>c</i> ⊕ Env(call) &nbsp; or ⟨end⟩ ⟹ stop</div>
          </div>
          <div class="where">
            <span class="label">Where</span>
            <div><b>t</b><span>position being predicted</span></div>
            <div><b>s<sub>tj</sub></b><span>raw attention score from position <i>t</i> to earlier token <i>j</i> (shown live in the step card)</span></div>
            <div><b>pos<sub>v</sub></b><span>where token <i>v</i> sits on the floor map</span></div>
            <div><b>σ</b><span>bump width of the surface (0.9 map units)</span></div>
            <div><b>Shown</b><span>the top 7 of ~100,000 candidates; the rest share the leftover mass</span></div>
            <div><b>KV cache</b><span>real systems store each token's <b>k</b>, <b>v</b> once, so step <i>t</i> only computes the new row: that's why streaming is fast</span></div>
          </div>
        </div>
      </div>`,
  init(){
const CODE='def add(a, b):\n    return a + b\n\ndef subtract(a, b):\n    return a - b\n\ndef multiply(a, b):\n    return a * b\n\ndef divide(a, b):\n    return a / b\n\nops = {"+": add, "-": subtract, "*": multiply, "/": divide}\n\na = float(input("First number: "))\nop = input("Operator: ")\nb = float(input("Second number: "))\nprint(ops[op](a, b))\n';
const FIX='\ndef divide(a, b):\n    if b == 0:\n        return "Error: can\'t divide by zero"\n    return a / b\n';
const PH=[{n:'Prompt in',k:'in'},{n:'Plan',k:'plan'},{n:'Act · write code',k:'act'},{n:'Observe · saved',k:'obs'},{n:'Act · run tests',k:'act'},{n:'Observe · 1 failed',k:'obs'},{n:'Plan · fix',k:'plan'},{n:'Act · edit',k:'act'},{n:'Observe · edited',k:'obs'},{n:'Act · re-test',k:'act'},{n:'Observe · passed',k:'obs'},{n:'Answer',k:'done'}];
const KL={in:['PROMPT IN',C.pinkL],plan:['PLAN',C.grapeL],act:['ACT · TOOL CALL',C.tangL],obs:['OBSERVE',C.skyL],done:['ANSWER',C.limeL]};
const SEGS=[
  {role:'system',kind:'in',ph:0,text:'⟨system⟩ You are a coding agent. Tools: write_file, run_tests, edit_file.'},
  {role:'user',kind:'in',ph:0,text:' ⟨user⟩ build me a calculator in python ⟨assistant⟩'},
  {role:'asst',kind:'gen',ph:1,text:" I'll write a simple calculator with add, subtract, multiply and divide, then test it."},
  {role:'asst',kind:'gen',ph:2,text:' ⟨call⟩ write_file("calculator.py", """\n'+CODE+'""") ⟨/call⟩'},
  {role:'tool',kind:'in',ph:3,text:' ⟨result⟩ saved calculator.py (17 lines) ⟨/result⟩'},
  {role:'asst',kind:'gen',ph:4,text:' ⟨call⟩ run_tests("calculator.py") ⟨/call⟩'},
  {role:'tool',kind:'in',ph:5,text:' ⟨result⟩ 4 passed, 1 failed: test_divide raised ZeroDivisionError: division by zero ⟨/result⟩'},
  {role:'asst',kind:'gen',ph:6,text:" Dividing by zero crashes. I'll return an error message instead."},
  {role:'asst',kind:'gen',ph:7,text:' ⟨call⟩ edit_file("calculator.py", """'+FIX+'""") ⟨/call⟩'},
  {role:'tool',kind:'in',ph:8,text:' ⟨result⟩ replaced divide() ⟨/result⟩'},
  {role:'asst',kind:'gen',ph:9,text:' ⟨call⟩ run_tests("calculator.py") ⟨/call⟩'},
  {role:'tool',kind:'in',ph:10,text:' ⟨result⟩ 5 passed ⟨/result⟩'},
  {role:'asst',kind:'gen',ph:11,text:" Here's your calculator! It's saved as calculator.py with add, subtract, multiply and divide. Run python calculator.py, type two numbers and an operator, and it prints the answer. Dividing by zero now shows an error instead of crashing. ⟨end⟩"}
];
const INNOTE={
  0:"Before you type anything, the app puts a system prompt into the context: the model's role plus a description of each tool. These are input tokens, so nothing is sampled and there is no probability hill yet. Each token drops onto the floor at its embedding's spot.",
  1:"Your message arrives wrapped in role markers by the chat template. The template also appends ⟨assistant⟩, which is how the model knows it's its turn. Your words land in the English region; every token after this one will be sampled.",
  4:"The agent harness (ordinary code, not the model) ran write_file and pasted back the result. Tool output arrives as one block of input tokens. No sampling happens here.",
  6:"The test runner found a bug: dividing by zero crashes. This failure is now in the context, where every later step can attend to it. Watch the beams over the next few steps.",
  9:"Edit applied. Another block of input tokens from the harness.",
  11:"All tests pass. The context now holds everything the model needs for its final reply."
};
const KW=new Set(['def','return','if','else','elif','while','for','import','print','float','int','input','try','except','class','lambda','None','not','in','raise','is','from','True','False']);
const OPS=new Set(['+','-','*','/','=','==','!=','%','**','//','>','<']);
const TOOLW=new Set(['write_file','run_tests','edit_file','read_file','search_web','⟨call⟩','⟨/call⟩','⟨result⟩','⟨/result⟩']);
const PUNCT=new Set(['(',')',':',',','{','}','[',']','"','.','"""','!','```','#']);
const CAT={
  eng:{x:-6,z:-4,col:0x2f8cff,n:'ENGLISH'},kw:{x:5,z:-5,col:0x8b4dff,n:'PY KEYWORDS'},name:{x:6,z:4,col:0x36d65a,n:'NAMES'},
  op:{x:1,z:7.5,col:0xff8a1f,n:'OPERATORS'},punct:{x:-1,z:0.5,col:0xc9c3d9,n:'PUNCTUATION'},ws:{x:-8.5,z:2.5,col:0x9a90d6,n:'NEWLINE / INDENT'},
  tool:{x:0,z:-8.5,col:0xff2d95,n:'TOOL SYNTAX'},lit:{x:-5,z:8.5,col:0xffd92e,n:'STRINGS & NUMBERS'},special:{x:8.5,z:-9.5,col:0xffffff,n:'CONTROL'}
};
const CONF={punct:5.2,ws:5.4,op:4.6,kw:4.6,name:3.8,tool:4.8,lit:3.6,eng:3.0,special:4.0};
const GAP={punct:3.0,ws:3.0,tool:3.0,op:2.0,kw:2.2,name:1.4,lit:1.6,eng:0.7,special:2.0};
const STEPG={punct:.8,ws:.8,tool:.8,op:.8,kw:.7,name:.6,lit:.6,eng:.45,special:.8};
const POOL={eng:['Sure','Let','Here','the','a','basic','simple','script','program','with','and','then','test','it','I','will','error','message','instead','fix','run','now','your','file','answer','result','check','first','so','this'],
  kw:['def','return','if','else','elif','while','for','import','print','float','int','input','try','except','class','lambda','None','not','in','raise'],
  name:['add','subtract','multiply','divide','a','b','x','y','ops','op','result','num1','num2','calc','main','value','operator','first','second'],
  op:['+','-','*','/','=','==','!=','%','**','//','>','<'],punct:['(',')',':',',','{','}','[',']','"','.','"""'],ws:['\n','\n    ','\n        ','\n\n'],
  tool:['⟨call⟩','⟨/call⟩','write_file','run_tests','edit_file','read_file','search_web'],lit:['0','1','2','8','First','Second','number','Error','zero','calculator','py','result'],special:['⟨end⟩','⟨user⟩']};
const NEIGH={name:['kw','op'],kw:['name','punct'],punct:['op','ws'],op:['name','punct'],ws:['kw','punct'],eng:['lit','name'],tool:['punct','eng'],lit:['eng','punct'],special:['eng','punct']};
const GN={punct:"Syntax token. Python's grammar leaves almost no choice here, so one tall spike dominates.",ws:"Newlines and indentation are tokens too. After a colon the model is very sure the next line is indented.",op:"Which operator comes next depends on what came before. Follow the beams.",kw:"Python keywords follow strong patterns, so probability piles onto the keyword region.",name:"Names are mostly copied from earlier in the context.",tool:"Tool-call syntax. The format was drilled in during fine-tuning, so it's near-certain.",lit:"Inside a string or number, the model fills in content that fits the surrounding code.",eng:"Plain English has many reasonable continuations, so the hill is lower and wider.",special:"A special control token."};
const OV={};const ov=(s,t,n,o)=>OV[s+'|'+t+'|'+n]=o;
ov(2,"I'll",0,{z:3.0,alts:[['Sure',2.4],['Let',2.2],['Here',1.6],['To',1.0]],att:['⟨assistant⟩','build'],note:"First token of the reply. Several openers are reasonable, so probability spreads into a low, wide hill across the English region instead of one spike."});
ov(2,'simple',0,{z:3.1,alts:[['basic',2.6],['command',2.2],['GUI',0.9],['scientific',0.6]],att:['build','calculator','me'],note:"A design choice in miniature. Your request didn't ask for a graphical interface or scientific functions, so 'GUI' and 'scientific' get little mass. A short, casual request pulls toward 'simple'."});
ov(2,'calculator',0,{att:['calculator'],note:"Copying: the strongest beam goes back to your word 'calculator'. Models copy relevant words from the prompt constantly; the circuits that do it are called induction heads."});
ov(2,'add',0,{z:3.4,alts:[['four',2.7],['basic',1.9],['+',0.8]],att:['calculator','simple'],note:"Calculators in training data overwhelmingly start with the four basic operations, so 'add' and 'four' lead."});
ov(2,'test',0,{att:['run_tests','Tools'],note:"'test' is pulled by the tool list in the system prompt. The model knows a run_tests tool exists, so its plan includes using it."});
ov(3,'⟨call⟩',0,{z:4.6,alts:[['Here',2.4],['```',2.6],['First',1.5]],att:['write_file','Tools','write'],note:"The key agent moment. The model could answer in chat (code inside ``` fences) or call a tool. The system prompt listed tools, so the tool-call token wins. This one token is where a chatbot becomes an agent."});
ov(3,'write_file',0,{alts:[['run_tests',2.2],['edit_file',1.8]],att:['write_file','write'],note:"Tool names are copied from the system prompt. A model can only call tools it has been told about."});
ov(3,'calculator',0,{att:['calculator','python'],note:"The filename is built from your words: 'calculator' now, and 'python' drives the '.py' extension two tokens later."});
ov(3,'py',0,{z:5.2,alts:[['txt',1.6],['js',0.9],['pyw',0.5]],att:['python'],note:"'.py' because you said python. The beam back to your word 'python' carries this choice."});
ov(3,'def',0,{z:4.6,alts:[['import',3.7],['class',2.4],['#',2.6]],att:['"""','python'],note:"First line of the file. Python scripts usually open with an import, a comment or a function. With nothing to import, 'def' edges ahead."});
ov(3,'add',0,{z:4.3,alts:[['calculate',3.0],['main',2.4],['subtract',1.8]],att:['add'],note:"The model copies its own plan. Beams reach back to the plan sentence where it wrote 'add, subtract, multiply and divide.'"});
ov(3,'a',0,{z:3.4,alts:[['x',3.0],['num1',2.7],['self',0.6]],att:['add','('],note:"'a, b' vs 'x, y' vs 'num1, num2' are all common in training data. A genuinely close call, so the hill is broad across the names region."});
ov(3,'b',0,{z:5.6,alts:[['y',2.0],['c',1.2]],att:['a'],note:"After 'a,' the letter 'b' is nearly certain. One tall spike: a pattern seen in millions of functions."});
ov(3,'+',0,{z:5.6,alts:[['-',1.6],['*',1.0],['/',0.6]],att:['add'],note:"The operator is chosen by looking back at the function name. The biggest beam goes to 'add'. If the function were named 'multiply', the spike would jump to '*'."});
ov(3,'subtract',0,{att:['subtract','add'],note:"Second function. The model follows the order it wrote in its plan."});
ov(3,'-',0,{z:5.6,alts:[['+',2.2],['*',0.9]],att:['subtract'],note:"Same trick: the beam to 'subtract' moves the spike to '-'. '+' keeps some mass because the previous function used it (recency)."});
ov(3,'*',0,{z:5.4,alts:[['+',1.7],['**',1.6]],att:['multiply'],note:"'*' because of 'multiply'. '**' (exponent) gets a little mass because it looks similar."});
ov(3,'/',0,{z:4.4,alts:[['//',3.4],['%',1.2]],att:['divide'],note:"'//' (whole-number division) is a real competitor. '/' wins because a calculator should give 7 / 2 = 3.5."});
ov(3,'ops',0,{z:3.2,alts:[['operations',2.9],['operators',2.7],['while',2.3],['OPS',1.2]],att:['add','subtract','multiply','divide'],note:"With four functions written, the model needs a way to choose between them. A dictionary is one idiom; a 'while' loop menu is another."});
ov(3,'float',0,{z:4.3,alts:[['int',3.8],['input',2.7]],att:['divide','/'],note:"'float' beats 'int' so the calculator accepts 2.5. A design decision made entirely by which token has more probability."});
ov(3,'print',0,{att:['ops','op','a','b'],note:"Last line: look up the chosen function in the dictionary and call it. Beams go back to 'ops', 'op', 'a' and 'b'."});
ov(3,'⟨/call⟩',0,{note:"Closing the tool call. When the harness sees ⟨/call⟩ it stops generation, runs the tool, and pastes back the result."});
ov(5,'⟨call⟩',0,{z:4.4,alts:[['Here',2.8],['I',2.4]],att:['test','run_tests','saved'],note:"The file is saved, but the plan said 'then test it.' The beam to 'test' in the model's own plan keeps it from declaring victory early."});
ov(5,'run_tests',0,{alts:[['edit_file',1.2],['write_file',1.0]],att:['run_tests','test']});
ov(7,'Dividing',0,{z:3.0,alts:[['Division',2.8],['The',2.6],['One',2.3],['Test',2.0]],att:['ZeroDivisionError','failed','test_divide'],note:"The tool result just arrived. The error tokens get the strongest beams: the model reads the failure before deciding what to say."});
ov(7,'zero',0,{att:['ZeroDivisionError','zero']});
ov(7,'error',0,{z:3.2,alts:[['exception',2.5],['None',1.4],['message',1.0]],att:['ZeroDivisionError','crashes'],note:"Return an error message, or raise an exception? Both are common. For a beginner-friendly calculator a message fits better."});
ov(8,'⟨call⟩',0,{att:['instead','return','error']});
ov(8,'edit_file',0,{z:4.4,alts:[['write_file',3.6],['run_tests',0.8]],att:['edit_file'],note:"edit_file vs write_file: rewriting the whole file would also work, but changing one function is smaller and safer."});
ov(8,'if',0,{z:4.4,alts:[['try',3.8],['return',2.2]],att:['zero','b','error'],note:"Check first ('if b == 0') or catch the crash ('try/except')? Both are idiomatic Python. The plan's wording ('return an error message') tips it toward a check."});
ov(8,'==',0,{z:5.2,alts:[['is',1.4],['<',0.6]],att:['b']});
ov(8,'0',0,{z:5.4,alts:[['None',1.6],['0.0',1.4]],att:['zero','ZeroDivisionError'],note:"'0' comes from the concept 'zero' in the failure message and the plan."});
ov(8,'Error',0,{att:['error','message']});
ov(10,'⟨call⟩',0,{z:4.2,alts:[['Here',3.0],['Done',2.4]],att:['replaced','test','run_tests'],note:"After editing, re-test. A careful agent verifies its fix instead of assuming it worked."});
ov(12,"Here's",0,{z:3.4,alts:[['Done',3.0],['I',2.6],['Your',2.4],['⟨call⟩',1.0]],att:['passed','⟨/result⟩'],note:"Tests pass, so instead of another tool call the model switches back to talking to you. '⟨call⟩' still keeps a little probability."});
ov(12,'calculator',0,{att:['calculator']});
ov(12,'Dividing',0,{att:['Dividing','zero','error','ZeroDivisionError'],note:"The model reports the bug it fixed, copying wording from its own earlier plan."});
ov(12,'⟨end⟩',0,{z:3.8,alts:[['Let',2.6],['Want',2.4],['⟨call⟩',0.6]],att:['passed'],note:"The stop token. When the harness sees ⟨end⟩ with no tool call, the loop is over and the message is shown to you."});

const h32=s=>{let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const rng=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
function posOf(cat,t){const c=CAT[cat],a=h32(t+'#a')/4294967296*Math.PI*2,r=Math.sqrt(h32(t+'#b')/4294967296)*2.2;return{x:c.x+r*Math.cos(a),z:c.z+r*Math.sin(a)}}
const dispT=t=>/^\n/.test(t)?(t==='\n\n'?'⏎⏎':'⏎'+'→'.repeat(Math.floor((t.length-1)/4))):t;
function catOf(s,fb){if(KW.has(s))return'kw';if(OPS.has(s))return'op';if(PUNCT.has(s))return'punct';if(/^\n/.test(s))return'ws';if(TOOLW.has(s))return'tool';if(/^⟨/.test(s))return'special';return['name','lit','eng'].includes(fb)?fb:'eng'}
function tokz(text){const re=/(\n *)|( ?)(⟨\/?[a-z]+⟩|"""|```|==|[A-Za-z_]+(?:'[a-z]+)?|\d+|[^\s\w])/g;const out=[];let m;while((m=re.exec(text))){out.push(m[1]!==undefined?m[1]:(m[2]||'')+m[3])}return out}

const TOK=[];const stackCount={};
SEGS.forEach((sg,si)=>{let mode='text',str=false;const seen={};
  tokz(sg.text).forEach(raw=>{const t=/^\n/.test(raw)?raw:raw.trim();let cat;
    if(t==='"""'){cat='punct';mode=mode==='code'?'text':'code';str=false}
    else if(t==='"'){cat='punct';str=!str}
    else if(/^\n/.test(t))cat='ws';
    else if(str)cat='lit';
    else if(/^⟨/.test(t))cat=TOOLW.has(t)?'tool':'special';
    else if(TOOLW.has(t))cat='tool';
    else if(mode==='code')cat=KW.has(t)?'kw':OPS.has(t)?'op':/^\d/.test(t)?'lit':/^[A-Za-z_]/.test(t)?'name':'punct';
    else cat=/^\d/.test(t)?'lit':/^[A-Za-z_]/.test(t)?'eng':'punct';
    const n=seen[t]=(seen[t]===undefined?0:seen[t]+1);const p=posOf(cat,t);const sk=cat+'|'+t;const st=stackCount[sk]=(stackCount[sk]===undefined?0:stackCount[sk]+1);
    TOK.push({raw,t,cat,seg:si,role:sg.role,gen:sg.kind==='gen',ph:sg.ph,x:p.x,z:p.z,stack:st,key:si+'|'+t+'|'+n,id:h32(t)%100256});
  });
});
const STEPS=[];
SEGS.forEach((sg,si)=>{const idx=[];TOK.forEach((t,i)=>{if(t.seg===si)idx.push(i)});
  if(sg.kind==='in')STEPS.push({type:'in',seg:si,from:idx[0],to:idx[idx.length-1]+1,ph:sg.ph});
  else idx.forEach(i=>STEPS.push({type:'gen',i,seg:si,ph:sg.ph}));});

const cache={};
function genData(i){if(cache[i])return cache[i];
  const tk=TOK[i],o=OV[tk.key]||{},R=rng(i*9973+7);
  const copied=!['punct','ws'].includes(tk.cat)&&TOK.slice(0,i).some(c=>c.t===tk.t);
  const z0=o.z!=null?o.z:CONF[tk.cat]+(copied?0.7:0)+R()*0.4;
  const cands=[{t:tk.t,cat:tk.cat,l:z0,win:true}];const used=new Set([tk.t]);
  (o.alts||[]).forEach(([s,z])=>{if(used.has(s))return;used.add(s);cands.push({t:s,cat:catOf(s,tk.cat),l:z})});
  const add=(cat,l)=>{const pool=POOL[cat].filter(s=>!used.has(s));if(!pool.length)return;const s=pool[Math.floor(R()*pool.length)];used.add(s);cands.push({t:s,cat,l})};
  const base=o.alts&&o.alts.length?Math.min(z0-GAP[tk.cat],Math.min(...o.alts.map(a=>a[1]))-0.6):z0-GAP[tk.cat];
  for(let k=0;k<6&&cands.length<5;k++)add(tk.cat,base-(k*STEPG[tk.cat]+R()*0.5));
  const nb=NEIGH[tk.cat];for(let k=0;k<4&&cands.length<6;k++)add(nb[k%2],z0-(3.6+R()*1.2));
  const others=Object.keys(CAT).filter(c=>c!==tk.cat&&c!=='special');for(let k=0;k<4&&cands.length<7;k++)add(others[Math.floor(R()*others.length)],z0-(6.5+R()*1.5));
  cands.forEach(c=>{const p=posOf(c.cat,c.t);c.px=p.x;c.pz=p.z});cands.sort((a,b)=>b.l-a.l);
  const s=new Float32Array(i);let mx=-1e9;
  for(let j=0;j<i;j++){const c=TOK[j];let v=-1;
    if(j===0)v+=3.0;
    v+=2.8*Math.exp(-(i-1-j)/2.2);
    if(!['punct','ws'].includes(tk.cat)&&c.t===tk.t)v+=2.4;
    if(o.att&&o.att.includes(c.t))v+=4.0;
    if(c.role==='user'&&c.cat==='eng')v+=0.8;
    if(c.cat==='punct'||c.cat==='ws')v-=0.6;
    s[j]=v*1.5;if(s[j]>mx)mx=s[j];}
  const a=new Float32Array(i);let sum=0;for(let j=0;j<i;j++){a[j]=Math.exp(s[j]-mx);sum+=a[j]}for(let j=0;j<i;j++)a[j]/=sum;
  const top=[...a.keys()].sort((x,y)=>a[y]-a[x]).slice(0,6);
  return cache[i]={tk,o,cands,a,s,top,copied};
}
const probsT=(cands,T)=>{const mx=Math.max(...cands.map(c=>c.l/T));const e=cands.map(c=>Math.exp(c.l/T-mx));const S=e.reduce((x,y)=>x+y,0);return e.map(v=>v/S)};

/* ---------- DOM panels ---------- */
let cur=STEPS.findIndex(s=>s.type==='gen'), playT=null, speed=1;
const phaseBar=$('#phaseBar');
PH.forEach((p,k)=>{const b=document.createElement('button');b.type='button';b.className='ph';b.dataset.k=p.k;b.textContent=(k+1)+' · '+p.n;b.dataset.hint='Jump to: '+p.n;
  b.onclick=()=>{go(STEPS.findIndex(s=>s.ph===k))};phaseBar.appendChild(b)});
const ctxBox=$('#r3Ctx');ctxBox.style.position='relative';
const chips=TOK.map((t,i)=>{const w=document.createElement('span');const c=document.createElement('span');c.className='cx r-'+t.role;
  if(t.cat==='ws'){c.textContent='⏎';w.appendChild(c);w.appendChild(document.createElement('br'));const ind=t.t.length-1;if(ind>0)w.appendChild(document.createTextNode(' '.repeat(ind)))}
  else{c.textContent=t.raw;w.appendChild(c)}
  c.title=`#${i} “${dispT(t.t)}” · ID ${t.id}`;w.hidden=true;ctxBox.appendChild(w);return{w,c}});

function chatHTML(end){let h='';
  const vis=si=>TOK.filter((t,i)=>t.seg===si&&i<end).map(t=>t.raw).join('');
  const full=si=>{const ix=TOK.map((t,i)=>t.seg===si?i:-1).filter(i=>i>=0);return ix.length&&ix[ix.length-1]<end};
  const strip=s=>s.replace(/⟨\/?[a-z]+⟩/g,'').trim();
  const code=s=>{const p=s.split('"""');return p.length>1?p[1].replace(/^\n/,''):''};
  SEGS.forEach((sg,si)=>{const v=vis(si);if(!v)return;const done=full(si);const cur=done?'':'<span class="cursor"></span>';
    if(si===0)h+='<p class="tip" style="text-align:center">system prompt + tool list (hidden from you)</p>';
    else if(si===1)h+=`<div class="bub me">${esc(strip(v))}</div>`;
    else if(si===2||si===7)h+=`<div class="bub think">thinking: ${esc(strip(v))}${cur}</div>`;
    else if(si===3||si===8)h+=`<div class="toolcard"><b>✎ ${si===3?'write_file · calculator.py':'edit_file · divide()'}</b><pre>${esc(code(v))}${done?'':'▌'}</pre></div>`;
    else if(si===5||si===10)h+=`<div class="toolcard"><b>▶ run_tests · calculator.py</b>${done?'running…':'<span class="tip">writing the call…</span>'}</div>`;
    else if(si===4||si===9)h+=`<div class="toolcard ok"><b>✓ ${esc(strip(v))}</b></div>`;
    else if(si===6)h+=`<div class="toolcard fail"><b>✗ TESTS</b>${esc(strip(v))}</div>`;
    else if(si===11)h+=`<div class="toolcard ok"><b>✓ TESTS</b>${esc(strip(v))}</div>`;
    else if(si===12)h+=`<div class="bub ai">${esc(strip(v))}${cur}</div>`;
  });return h}

function panels(){
  const st=STEPS[cur];const T=+$('#r3T').value;const ph=PH[st.ph];
  $('#r3Head').textContent=`Step ${cur+1} of ${STEPS.length} · ${ph.n}`;
  const kc=$('#r3Kind');kc.textContent=KL[ph.k][0];kc.style.background=KL[ph.k][1];
  $$('#phaseBar .ph').forEach((b,k)=>b.setAttribute('aria-current',k===st.ph));
  const end=st.type==='gen'?st.i:st.to;
  let d=null;if(st.type==='gen')d=genData(st.i);
  // context heatmap
  chips.forEach((c,i)=>{const show=i<end||(d&&i===st.i);c.w.hidden=!show;c.c.classList.toggle('next',!!(d&&i===st.i));
    c.c.classList.toggle('fresh',st.type==='in'&&i>=st.from&&i<st.to);
    c.c.style.background=d&&i<st.i?`rgba(255,45,149,${Math.min(.95,d.a[i]*4).toFixed(3)})`:''});
  $('#r3CtxN').textContent=`${end.toLocaleString()} tokens in context`;
  const focus=chips[d?st.i:Math.max(0,end-1)].w;ctxBox.scrollTop=Math.max(0,focus.offsetTop-ctxBox.clientHeight*.6);
  // chat
  const chat=$('#r3Chat');chat.innerHTML=chatHTML(end);chat.scrollTop=chat.scrollHeight;
  const tbl=$('#r3Cands');
  if(d){
    const p=probsT(d.cands,T);
    $('#r3Note').textContent=(d.o.note||GN[d.tk.cat]+(d.copied?' This exact token appeared earlier in the context, so copying boosts it: see the beam back to its earlier copy.':''));
    $('#r3CandLbl').textContent=`Predicting token #${st.i}: top 7 of ~100,000 candidates`;
    tbl.innerHTML='<div class="crow head"><span>TOKEN</span><span style="text-align:right">LOGIT</span><span>P AT T='+T.toFixed(2)+'</span><span></span></div>'+d.cands.map((c,k)=>`<div class="crow${c.win?' win':''}"><span class="tk">${c.win?'★ ':''}${esc(dispT(c.t))}</span><span class="z">${c.l.toFixed(2)}</span><div class="tr"><i style="width:${(p[k]*100).toFixed(1)}%"></i></div><span class="pc">${(p[k]*100).toFixed(1)}%</span></div>`).join('');
    const wi=d.cands.findIndex(c=>c.win);const ex=d.cands.map(c=>Math.exp(c.l/T));const S=ex.reduce((x,y)=>x+y,0);
    $('#r3Live').innerHTML=`p(“${esc(dispT(d.tk.t))}”) = e<sup>z/T</sup> ÷ Σ<sub>j</sub> e<sup>z<sub>j</sub>/T</sup> with logit z = <b>${d.cands[wi].l.toFixed(2)}</b>, temperature T = <b>${T.toFixed(2)}</b><br>= e<sup>${(d.cands[wi].l/T).toFixed(2)}</sup> ÷ (sum over the 7 shown) = ${ex[wi].toFixed(1)} ÷ ${S.toFixed(1)} = <b>${(ex[wi]/S).toFixed(3)}</b><br><span style="font-size:16px">${tNote(T)}</span><br>Top attention: `+d.top.slice(0,3).map(j=>`s(“${esc(dispT(TOK[j].t))}”#${j}) = ${d.s[j].toFixed(1)} → a = <b>${d.a[j].toFixed(2)}</b>`).join(' · ');
  }else{
    const toks=TOK.slice(st.from,st.to);
    $('#r3Note').textContent=INNOTE[st.seg]||'Input tokens arrive.';
    $('#r3CandLbl').textContent=`${toks.length} input tokens arriving (nothing sampled)`;
    tbl.innerHTML='<div class="tok-out" style="font-size:17px">'+toks.map((t,k)=>`<span class="tok" style="background:${TCOL[k%TCOL.length]}" title="ID ${t.id}">${esc(dispT(t.t))}<sub style="font-size:12px;opacity:.6"> ${t.id}</sub></span>`).join('')+'</div>';
    const t0=toks.find(t=>t.cat==='eng')||toks[0];
    $('#r3Live').innerHTML=`h<sub>i</sub><sup>(0)</sup> = W<sub>E</sub>[x<sub>i</sub>] + PE(i): e.g. “${esc(dispT(t0.t))}” → x = <b>${t0.id}</b> → a row of ~4,096 numbers, placed at position i = ${TOK.indexOf(t0)}. These tokens are only read, never predicted, so they add context without any probability step.`;
  }
  $('#r3Prev').disabled=cur===0;$('#r3Next').disabled=cur>=STEPS.length-1;
  scene3d(d,st,end,T);
}
function go(k){cur=Math.max(0,Math.min(STEPS.length-1,k));blip(380+(cur%12)*35,.05);panels()}
$('#r3Next').onclick=()=>go(cur+1);$('#r3Prev').onclick=()=>go(cur-1);
$('#r3PhNext').onclick=()=>{const ph=STEPS[cur].ph;const k=STEPS.findIndex(s=>s.ph>ph);if(k>=0)go(k)};
$('#r3PhPrev').onclick=()=>{const ph=STEPS[cur].ph;const first=STEPS.findIndex(s=>s.ph===ph);go(cur>first?first:STEPS.findIndex(s=>s.ph===Math.max(0,ph-1)))};
function stopPlay(){clearInterval(playT);playT=null;$('#r3Play').textContent='Play'}
function startPlay(){stopPlay();if(cur>=STEPS.length-1)cur=0;$('#r3Play').textContent='Pause';playT=setInterval(()=>{if(cur>=STEPS.length-1||$('#toy-run3d').hidden){stopPlay();return}go(cur+1)},Math.round(900/speed))}
$('#r3Play').onclick=()=>playT?stopPlay():startPlay();
$$('#r3Speed button').forEach(b=>b.onclick=()=>{speed=+b.dataset.v;$$('#r3Speed button').forEach(x=>x.setAttribute('aria-pressed',x===b));if(playT)startPlay()});
$('#r3T').addEventListener('input',()=>{$('#r3TOut').textContent=(+$('#r3T').value).toFixed(2);panels()});
document.addEventListener('keydown',e=>{if($('#toy-run3d').hidden||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;if(e.key==='ArrowRight'){e.preventDefault();go(cur+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(cur-1)}});

/* ---------- 3D scene: hand-rolled canvas renderer (no libraries) ---------- */
const host=$('#stage3d');let G=null;const Hh=8,SIG=0.9,GR=48,EXT=12;
const VIEWS={'3d':{th:.85,ph:.98,r:31},top:{th:Math.PI/2,ph:.03,r:30},side:{th:Math.PI/2,ph:1.42,r:30}};
const cam={th:.85,ph:.98,r:31},camGoal={...cam};
$$('#r3View button').forEach(b=>b.onclick=()=>{Object.assign(camGoal,VIEWS[b.dataset.v]);$$('#r3View button').forEach(x=>x.setAttribute('aria-pressed',x===b));$('#hud1').textContent=b.dataset.v==='top'?'top view: brighter = more probable':'x, z: meaning map (2-D projection)';if(G)G.dirty=true});
const STOPS=[[0,42,32,110],[.18,47,140,255],[.42,54,214,90],[.68,255,217,46],[1,255,45,149]];
function heat(v){v=Math.max(0,Math.min(1,v));for(let s=1;s<STOPS.length;s++){if(v<=STOPS[s][0]){const a=STOPS[s-1],b=STOPS[s],f=(v-a[0])/(b[0]-a[0]);return[a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f,a[3]+(b[3]-a[3])*f]}}return STOPS[4].slice(1)}
const hex=n=>'#'+n.toString(16).padStart(6,'0');
const ROLECOL={system:'#b9b3c6',user:'#ff2d95',asst:'#8b4dff',tool:'#2f8cff'};
const LIGHT=(()=>{const l=[.4,.85,.35],m=Math.hypot(...l);return l.map(v=>v/m)})();
const shade=(rgb,f)=>`rgb(${Math.min(255,rgb[0]*f)|0},${Math.min(255,rgb[1]*f)|0},${Math.min(255,rgb[2]*f)|0})`;
const rgbOf=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
function init3d(){
  if(G)return;
  const cv=document.createElement('canvas');cv.setAttribute('aria-label','3D probability landscape');host.prepend(cv);
  const ctx=cv.getContext('2d');const NV=(GR+1)*(GR+1);
  const g={cv,ctx,W:0,H:0,dpr:1,cur:new Float32Array(NV),tgt:new Float32Array(NV),proj:new Float32Array(NV*3),dirty:true,
    bars:Array.from({length:7},()=>({x:0,z:0,cur:0,tgt:0,col:'#2f8cff',label:'',win:false,show:false,on:false})),
    sph:TOK.map(t=>{const y=.28+Math.min(t.stack,14)*.3;return{x:t.x,z:t.z,y,cy:y,s:.15,ts:.15,vis:false,col:rgbOf(ROLECOL[t.role])}}),
    beams:[],ctxL:[],orbOn:false,down:0};
  const fit=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;g.dpr=Math.min(2,window.devicePixelRatio||1);g.W=w;g.H=h;cv.width=Math.round(w*g.dpr);cv.height=Math.round(h*g.dpr);cv.style.width=w+'px';cv.style.height=h+'px';g.dirty=true};
  try{new ResizeObserver(fit).observe(host)}catch(_){window.addEventListener('resize',fit)}fit();
  let drag=null;
  cv.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,th:camGoal.th,ph:camGoal.ph};try{cv.setPointerCapture(e.pointerId)}catch(_){}});
  cv.addEventListener('pointermove',e=>{if(!drag)return;camGoal.th=drag.th+(e.clientX-drag.x)*.008;camGoal.ph=Math.max(.03,Math.min(1.5,drag.ph-(e.clientY-drag.y)*.006))});
  const end=()=>drag=null;cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);
  cv.addEventListener('wheel',e=>{e.preventDefault();camGoal.r=Math.max(14,Math.min(60,camGoal.r*(1+Math.sign(e.deltaY)*.08)))},{passive:false});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>g.dirty=true);
  G=g;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;let t0=performance.now();
  (function loop(now){requestAnimationFrame(loop);if($('#toy-run3d').hidden){t0=now;return}
    const dt=Math.min(.05,(now-t0)/1000);t0=now;const k=reduce?1:Math.min(1,dt*9);let moving=false;
    for(const p of['th','ph','r']){const d=camGoal[p]-cam[p];if(Math.abs(d)>1e-4){cam[p]+=d*k;moving=true}}
    for(let v=0;v<NV;v++){const d=g.tgt[v]-g.cur[v];if(Math.abs(d)>.003){g.cur[v]+=d*k;moving=true}else g.cur[v]=g.tgt[v]}
    g.bars.forEach(b=>{const d=b.tgt-b.cur;if(Math.abs(d)>.003){b.cur+=d*k;moving=true}});
    g.sph.forEach(s=>{if(!s.vis)return;const d=s.y-s.cy;if(Math.abs(d)>.003){s.cy+=d*k;moving=true}const e=s.ts-s.s;if(Math.abs(e)>.002){s.s+=e*k;moving=true}});
    if(moving||g.dirty){draw(g);g.dirty=false}
  })(t0);
}
function draw(g){
  const{ctx,W,H,dpr}=g;ctx.setTransform(dpr,0,0,dpr,0,0);
  const sp=Math.sin(cam.ph),cp=Math.cos(cam.ph),ct=Math.cos(cam.th),st=Math.sin(cam.th);
  const TY=3.2,R=cam.r*(W/H<1.1?1.12:1);const eye=[R*sp*ct,TY+R*cp,R*sp*st];
  let f=[-eye[0],TY-eye[1],-eye[2]];const fm=Math.hypot(...f);f=f.map(v=>v/fm);
  const r=[st,0,-ct];const u=[r[1]*f[2]-r[2]*f[1],r[2]*f[0]-r[0]*f[2],r[0]*f[1]-r[1]*f[0]];
  const foc=H/(2*Math.tan(21*Math.PI/180));
  const P=(x,y,z)=>{const vx=x-eye[0],vy=y-eye[1],vz=z-eye[2];const d=vx*f[0]+vy*f[1]+vz*f[2];if(d<.5)return null;const s=foc/d;return[W/2+(vx*r[0]+vy*r[1]+vz*r[2])*s,H/2-(vx*u[0]+vy*u[1]+vz*u[2])*s,d,s]};
  ctx.fillStyle='#15103a';ctx.fillRect(0,0,W,H);
  // floor
  const poly=(pts,fill,stroke,lw)=>{const q=pts.map(p=>P(...p));if(q.some(v=>!v))return;ctx.beginPath();q.forEach((v,i)=>i?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||1;ctx.stroke()}};
  poly([[-EXT,0,-EXT],[EXT,0,-EXT],[EXT,0,EXT],[-EXT,0,EXT]],'#221a55');
  ctx.lineWidth=1;ctx.strokeStyle='rgba(120,105,220,.35)';ctx.beginPath();
  for(let i=-EXT;i<=EXT;i+=2){let a=P(i,0,-EXT),b=P(i,0,EXT);if(a&&b){ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1])}a=P(-EXT,0,i);b=P(EXT,0,i);if(a&&b){ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1])}}ctx.stroke();
  for(const kk in CAT){const c=CAT[kk];const pts=[];for(let a=0;a<36;a++){const t=a/36*Math.PI*2;pts.push([c.x+2.6*Math.cos(t),.01,c.z+2.6*Math.sin(t)])}
    const col=hex(c.col);poly(pts,col+'2a',col+'cc',2);
    const lp=P(c.x,0,c.z+3.15);if(lp){ctx.font='10px Bungee, "Arial Black", sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillText(c.n,lp[0]+1,lp[1]+1);ctx.fillStyle='rgba(255,255,255,.85)';ctx.fillText(c.n,lp[0],lp[1])}}
  // collect depth-sorted items
  const items=[];const N1=GR+1,step=2*EXT/GR,pr=g.proj;
  let any=false;for(let v=0;v<N1*N1;v++){if(g.cur[v]>.03){any=true;break}}
  if(any){for(let i=0;i<N1;i++)for(let k=0;k<N1;k++){const v=i*N1+k;const p=P(-EXT+k*step,g.cur[v],-EXT+i*step);if(p){pr[v*3]=p[0];pr[v*3+1]=p[1];pr[v*3+2]=p[2]}else pr[v*3+2]=-1}
    for(let i=0;i<GR;i++)for(let k=0;k<GR;k++){const a=i*N1+k,b=a+1,c=a+N1,d=c+1;const hs=[g.cur[a],g.cur[b],g.cur[c],g.cur[d]];const mx=Math.max(...hs);if(mx<.03)continue;
      if(pr[a*3+2]<0||pr[b*3+2]<0||pr[c*3+2]<0||pr[d*3+2]<0)continue;
      const dx=[step,hs[1]-hs[0],0],dz=[0,hs[2]-hs[0],step];const n=[dx[1]*dz[2]-dx[2]*dz[1],dx[2]*dz[0]-dx[0]*dz[2],dx[0]*dz[1]-dx[1]*dz[0]];const nm=Math.hypot(...n);const lam=Math.abs((n[0]*LIGHT[0]+n[1]*LIGHT[1]+n[2]*LIGHT[2])/nm);
      const avg=(hs[0]+hs[1]+hs[2]+hs[3])/4;items.push({t:0,d:(pr[a*3+2]+pr[d*3+2])/2,a,b,c,dd:d,col:heat(avg/Hh*1.15),f:.55+.6*lam,al:Math.min(.9,.35+avg*.4)})}}
  g.sph.forEach((s,j)=>{if(!s.vis)return;const p=P(s.x,s.cy,s.z);if(p)items.push({t:1,d:p[2],p,s})});
  g.bars.forEach(b=>{if(!b.show||b.cur<.01)return;const p=P(b.x,b.cur/2,b.z);if(p)items.push({t:2,d:p[2],b})});
  const orbY=9.6,op=P(0,orbY,0);if(op)items.push({t:3,d:op[2],p:op});
  items.sort((x,y)=>y.d-x.d);
  for(const it of items){
    if(it.t===0){ctx.beginPath();ctx.moveTo(pr[it.a*3],pr[it.a*3+1]);ctx.lineTo(pr[it.b*3],pr[it.b*3+1]);ctx.lineTo(pr[it.dd*3],pr[it.dd*3+1]);ctx.lineTo(pr[it.c*3],pr[it.c*3+1]);ctx.closePath();
      ctx.fillStyle=`rgba(${Math.min(255,it.col[0]*it.f)|0},${Math.min(255,it.col[1]*it.f)|0},${Math.min(255,it.col[2]*it.f)|0},${it.al.toFixed(2)})`;ctx.fill();ctx.strokeStyle='rgba(255,255,255,.07)';ctx.lineWidth=.7;ctx.stroke()}
    else if(it.t===1){const s=it.s,p=it.p,rad=Math.max(1.5,s.s*p[3]);const gr=ctx.createRadialGradient(p[0]-rad*.35,p[1]-rad*.4,rad*.1,p[0],p[1],rad);
      gr.addColorStop(0,'#fff');gr.addColorStop(.35,shade(s.col,1.05));gr.addColorStop(1,shade(s.col,.55));ctx.beginPath();ctx.arc(p[0],p[1],rad,0,Math.PI*2);ctx.fillStyle=gr;ctx.fill();if(rad>4){ctx.strokeStyle='rgba(26,16,51,.9)';ctx.lineWidth=1.2;ctx.stroke()}}
    else if(it.t===2){const b=it.b,w=.24,rgb=rgbOf(b.col);
      const cs=[[-w,-w],[w,-w],[w,w],[-w,w]].map(([dx,dz])=>[b.x+dx,b.z+dz]);
      const faces=[[0,1,[0,0,-1]],[1,2,[1,0,0]],[2,3,[0,0,1]],[3,0,[-1,0,0]]];
      faces.forEach(([i0,i1,n])=>{const cx=(cs[i0][0]+cs[i1][0])/2,cz=(cs[i0][1]+cs[i1][1])/2;if((eye[0]-cx)*n[0]+(eye[2]-cz)*n[2]<=0)return;
        const lam=Math.max(0,n[0]*LIGHT[0]+n[2]*LIGHT[2]);poly([[cs[i0][0],0,cs[i0][1]],[cs[i1][0],0,cs[i1][1]],[cs[i1][0],b.cur,cs[i1][1]],[cs[i0][0],b.cur,cs[i0][1]]],shade(rgb,.62+.5*lam),'#1a1033',1.2)});
      if(eye[1]>b.cur)poly(cs.map(([x,z])=>[x,b.cur,z]),shade(rgb,1.3),'#1a1033',1.2)}
    else if(it.t===3){const p=it.p,rad=.75*p[3];ctx.save();ctx.shadowColor='rgba(255,217,46,'+(g.orbOn?.9:.3)+')';ctx.shadowBlur=g.orbOn?28:10;
      const gr=ctx.createRadialGradient(p[0]-rad*.35,p[1]-rad*.4,rad*.1,p[0],p[1],rad);gr.addColorStop(0,'#fff');gr.addColorStop(.4,g.orbOn?'#ffd92e':'#8a7a2a');gr.addColorStop(1,g.orbOn?'#c98a00':'#4a3f12');
      ctx.beginPath();ctx.arc(p[0],p[1],rad,0,Math.PI*2);ctx.fillStyle=gr;ctx.fill();ctx.restore();ctx.strokeStyle='#1a1033';ctx.lineWidth=1.5;ctx.stroke()}
  }
  // beams (light, drawn on top)
  if(op&&g.beams.length){ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    g.beams.forEach(bm=>{const s=g.sph[bm.j];const p=P(s.x,s.cy,s.z);if(!p)return;ctx.strokeStyle=`rgba(255,45,149,${bm.al.toFixed(2)})`;ctx.lineWidth=bm.w;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(op[0],op[1]);ctx.stroke()});
    ctx.setLineDash([5,5]);ctx.lineWidth=2;ctx.strokeStyle='rgba(255,217,46,.75)';
    g.bars.slice(0,g.down).forEach(b=>{const p=P(b.x,b.cur,b.z);if(!p)return;ctx.beginPath();ctx.moveTo(op[0],op[1]);ctx.lineTo(p[0],p[1]);ctx.stroke()});ctx.restore()}
  // labels
  const placed=[];
  const tag=(wx,wy,wz,text,bg,fg,size,dy)=>{const p=P(wx,wy,wz);if(!p)return;ctx.font=`${size}px VT323, "Courier New", monospace`;const tw=ctx.measureText(text).width;const bw=tw+10,bh=size+4;const x=Math.max(bw/2+3,Math.min(W-bw/2-3,p[0]));let y=Math.max(bh+3,p[1]-(dy||6));for(let n=0;n<8;n++){const hit=placed.find(q=>Math.abs(q.x-x)<(q.w+bw)/2+2&&Math.abs(q.y-y)<(q.h+bh)/2+1);if(!hit)break;y=hit.y-hit.h-2}placed.push({x,y,w:bw,h:bh});ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x-bw/2,y-bh,bw,bh,4);else ctx.rect(x-bw/2,y-bh,bw,bh);ctx.fillStyle=bg;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#1a1033';ctx.stroke();
    ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,x,y-bh/2+1)};
  if(g.orbOn&&op)tag(0,orbY+.9,0,'h_t: context vector','#ffd92e','#1a1033',16,4);
  g.bars.forEach(b=>{if(b.on&&b.cur>.05)tag(b.x,b.cur+.1,b.z,b.label,b.win?'#ff2d95':'#fffdf4',b.win?'#fff':'#1a1033',b.win?19:16,4)});
  g.ctxL.forEach(l=>{const s=g.sph[l.j];tag(s.x,s.cy+s.s+.15,s.z,l.text,'#ffd92e','#1a1033',15,4)});
}
function scene3d(d,st,end,T){
  if(!G)return;const g=G;
  g.sph.forEach((s,j)=>{const vis=j<end;if(vis&&!s.vis){s.vis=true;s.cy=s.y+6}if(!vis)s.vis=false;
    s.ts=d?.15+1.05*Math.sqrt(d.a[j]||0):(st.type==='in'&&j>=st.from&&j<st.to?.32:.15)});
  const N1=GR+1,step=2*EXT/GR;
  if(d){const p=probsT(d.cands,T);
    d.cands.forEach((c,k)=>{const b=g.bars[k];if(b.key!==c.t+'@'+cur){b.cur=0;b.key=c.t+'@'+cur}b.show=true;b.x=c.px;b.z=c.pz;b.tgt=p[k]*Hh;b.win=!!c.win;
      b.col=c.win?'#ff2d95':(CAT[c.cat].col===0xffffff?'#dddddd':hex(CAT[c.cat].col));b.on=k<4&&p[k]>.015;b.label=`${dispT(c.t)} ${(p[k]*100).toFixed(p[k]<.1?1:0)}%`});
    for(let i=0;i<N1;i++)for(let k=0;k<N1;k++){const x=-EXT+k*step,z=-EXT+i*step;let h=0;for(let q=0;q<d.cands.length;q++){const c=d.cands[q];const dx=x-c.px,dz=z-c.pz;const r2=dx*dx+dz*dz;if(r2<16)h+=p[q]*Hh*.82*Math.exp(-r2/(2*SIG*SIG))}g.tgt[i*N1+k]=h}
    const mx=d.a[d.top[0]]||1;g.beams=d.top.map(j=>({j,w:1+9*Math.sqrt(d.a[j]),al:.25+.7*(d.a[j]/mx)}));
    g.down=p.filter(v=>v>.04).length>3?3:p.filter(v=>v>.04).length;
    g.ctxL=d.top.slice(0,3).map(j=>({j,text:`${dispT(TOK[j].t)} · ${d.a[j].toFixed(2)}`}));g.orbOn=true;
  }else{g.bars.forEach(b=>{b.tgt=0;b.on=false});g.tgt.fill(0);g.beams=[];g.down=0;g.ctxL=[];g.orbOn=false}
  g.dirty=true;
}
TOYS.run3d.onOpen=()=>{init3d();panels()};
panels();
  }};
