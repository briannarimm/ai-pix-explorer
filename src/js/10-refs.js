/* ==== REFERENCES (APA 7) and the text-markup helper ====
   In text: {{c:key}} = (Author, Year)   {{c:key|p. 5}} = (Author, Year, p. 5)   {{c:k1,k2}} = (A, 2020; B, 2021)
            {{n:key}} = Author (Year)     [[term]] = glossary hover word
   Every full entry also lists up to 5 "era" tags and the levels that cite it. */
const REFS={
  mcculloch1943:{y:1943,a1:'McCulloch & Pitts',an:'McCulloch and Pitts',yt:'1943/2021',era:'roots',
    apa:'McCulloch, W. S., & Pitts, W. (2021). A logical calculus of the ideas immanent in nervous activity. In H. R. Lewis (Ed.), <i>Ideas that created the future: Classic papers of computer science</i> (Chap. 9). MIT Press. (Original work published 1943)',
    short:'A Logical Calculus of Nervous Activity',line:'Neurons as on/off switches with thresholds can compute logic. The first mathematical neural network.',lvl:[1]},
  lewis2021:{y:2021,a1:'Lewis',an:'Lewis',era:'roots',
    apa:'Lewis, H. R. (Ed.). (2021). <i>Ideas that created the future: Classic papers of computer science</i>. MIT Press.',
    short:'Editor’s commentary on McCulloch & Pitts',line:'Commentary on how the 1943 model fed finite automata and neural computing.',lvl:[1],hidden:true},
  minsky1961:{y:1961,a1:'Minsky',an:'Minsky',era:'roots',
    apa:'Minsky, M. (1961). Steps toward artificial intelligence. <i>Proceedings of the IRE, 49</i>(1), 8–30.',
    short:'Steps Toward Artificial Intelligence',line:'Splits the problem into search, pattern recognition, learning, planning and induction.',lvl:[1]},
  samuel1962:{y:1962,a1:'Samuel',an:'Samuel',era:'roots',
    apa:'Samuel, A. L. (1962). Artificial intelligence: A frontier of automation. <i>The Annals of the American Academy of Political and Social Science, 340</i>, 10–20. https://www.jstor.org/stable/1033694',
    short:'AI: A Frontier of Automation',line:'A checkers program that learns by adjusting the weights on board features.',lvl:[1]},
  thomasian1963:{y:1963,a1:'Thomasian',an:'Thomasian',era:'roots',
    apa:'Thomasian, A. J. (1963). Foundations of information theory. In L. A. Zadeh (Ed.), Report on progress in information theory in the U.S.A., 1960–1963. <i>IEEE Transactions on Information Theory, 9</i>(4), 221–223.',
    short:'Foundations of Information Theory',line:'A survey of work extending Shannon’s 1948 theory of noisy channels and capacity.',lvl:[1]},
  findler1964:{y:1964,a1:'Findler',an:'Findler',era:'roots',
    apa:'Findler, N. V. (1964). Machine learning from noisy information. <i>Nature, 204</i>(4953), 103.',
    short:'Machine Learning from Noisy Information',line:'Decode Morse by matching letter frequencies, then add noise and see how much redundancy survives.',lvl:[1,13]},
  persson1964:{y:1964,a1:'Persson',an:'Persson',era:'roots',
    apa:'Persson, S. (1964). An introduction to artificial intelligence. <i>Ekonomisk Tidskrift, 66</i>(2), 88–112. https://www.jstor.org/stable/3438581',
    short:'An Introduction to Artificial Intelligence',line:'A survey for business readers: game players, theorem provers, question answerers, learning.',lvl:[1]},
  fu1982:{y:1982,a1:'Fu',an:'Fu',era:'learning',
    apa:'Fu, K.-S. (1982). Pattern recognition for automatic visual inspection. <i>Computer, 15</i>(12), 34–40.',
    short:'Pattern Recognition for Visual Inspection',line:'Three families: template matching, feature vectors, and structural grammars.',lvl:[1,3]},
  abumostafa2012:{y:2012,a1:'Abu-Mostafa',an:'Abu-Mostafa',era:'learning',
    apa:'Abu-Mostafa, Y. S. (2012). Machines that think for themselves. <i>Scientific American, 307</i>(1), 78–81. https://www.jstor.org/stable/26016002',
    short:'Machines That Think for Themselves',line:'Supervised, reinforcement and unsupervised learning, overfitting, and the Netflix Prize.',lvl:[1]},
  vaswani2017:{y:2017,a1:'Vaswani et al.',an:'Vaswani et al.',era:'language',
    apa:'Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. <i>Advances in Neural Information Processing Systems, 30</i>. https://arxiv.org/abs/1706.03762',
    short:'Attention Is All You Need',line:'The transformer: layers of attention replace recurrence, and training parallelizes.',lvl:[2,3,4,7]},
  tantawi2018:{y:2018,a1:'Tantawi',an:'Tantawi',era:'learning',
    apa:'Tantawi, R. (2018). Machine learning. In D. R. Franceschetti (Ed.), <i>Principles of programming & coding</i> (pp. 173–174). Salem Press.',
    short:'Machine Learning (encyclopedia entry)',line:'Perceptrons, their limits, and the families of learning algorithms.',lvl:[1]},
  devlin2019:{y:2019,a1:'Devlin et al.',an:'Devlin et al.',era:'language',
    apa:'Devlin, J., Chang, M.-W., Lee, K., & Toutanova, K. (2019). BERT: Pre-training of deep bidirectional transformers for language understanding. In <i>Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies</i> (Vol. 1, pp. 4171–4186). https://arxiv.org/abs/1810.04805',
    short:'BERT',line:'Hide 15% of the words and predict them from both sides. Then fine-tune.',lvl:[2,5]},
  kaplan2020:{y:2020,a1:'Kaplan et al.',an:'Kaplan et al.',era:'language',
    apa:'Kaplan, J., McCandlish, S., Henighan, T., Brown, T. B., Chess, B., Child, R., Gray, S., Radford, A., Wu, J., & Amodei, D. (2020). <i>Scaling laws for neural language models</i> (arXiv:2001.08361). arXiv. https://arxiv.org/abs/2001.08361',
    short:'Scaling Laws for Neural Language Models',line:'Loss falls as a smooth power law in model size, data and compute.',lvl:[6]},
  brown2020:{y:2020,a1:'Brown et al.',an:'Brown et al.',era:'language',
    apa:'Brown, T. B., Mann, B., Ryder, N., Subbiah, M., Kaplan, J., Dhariwal, P., Neelakantan, A., Shyam, P., Sastry, G., Askell, A., Agarwal, S., Herbert-Voss, A., Krueger, G., Henighan, T., Child, R., Ramesh, A., Ziegler, D. M., Wu, J., Winter, C., . . . Amodei, D. (2020). Language models are few-shot learners. <i>Advances in Neural Information Processing Systems, 33</i>, 1877–1901. https://arxiv.org/abs/2005.14165',
    short:'Language Models Are Few-Shot Learners (GPT-3)',line:'A 175-billion-parameter model learns tasks from examples in its prompt, with no retraining.',lvl:[2,5,6,9,13]},
  lewis2020:{y:2020,a1:'Lewis et al.',an:'Lewis et al.',era:'tuning',
    apa:'Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., Küttler, H., Lewis, M., Yih, W.-t., Rocktäschel, T., Riedel, S., & Kiela, D. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks. <i>Advances in Neural Information Processing Systems, 33</i>, 9459–9474. https://arxiv.org/abs/2005.11401',
    short:'Retrieval-Augmented Generation',line:'Pair a generator with a searchable index so answers draw on documents you can swap and cite.',lvl:[10]},
  han2021:{y:2021,a1:'Han et al.',an:'Han et al.',era:'language',
    apa:'Han, X., Zhang, Z., Ding, N., Gu, Y., Liu, X., Huo, Y., Qiu, J., Yao, Y., Zhang, A., Zhang, L., Han, W., Huang, M., Jin, Q., Lan, Y., Liu, Y., Liu, Z., Lu, Z., Qiu, X., Song, R., . . . Zhu, J. (2021). Pre-trained models: Past, present and future. <i>AI Open, 2</i>, 225–250. https://doi.org/10.1016/j.aiopen.2021.08.002',
    short:'Pre-trained Models: Past, Present and Future',line:'From word vectors to contextual vectors to pre-train-then-fine-tune as the default recipe.',lvl:[3,5]},
  wei2022:{y:2022,a1:'Wei et al.',an:'Wei et al.',era:'tuning',
    apa:'Wei, J., Wang, X., Schuurmans, D., Bosma, M., Ichter, B., Xia, F., Chi, E. H., Le, Q. V., & Zhou, D. (2022). Chain-of-thought prompting elicits reasoning in large language models. <i>Advances in Neural Information Processing Systems, 35</i>, 24824–24837. https://arxiv.org/abs/2201.11903',
    short:'Chain-of-Thought Prompting',line:'Show worked steps in the prompt and big models reason through multi-step problems.',lvl:[9]},
  ouyang2022:{y:2022,a1:'Ouyang et al.',an:'Ouyang et al.',era:'tuning',
    apa:'Ouyang, L., Wu, J., Jiang, X., Almeida, D., Wainwright, C. L., Mishkin, P., Zhang, C., Agarwal, S., Slama, K., Ray, A., Schulman, J., Hilton, J., Kelton, F., Miller, L., Simens, M., Askell, A., Welinder, P., Christiano, P., Leike, J., & Lowe, R. (2022). Training language models to follow instructions with human feedback. <i>Advances in Neural Information Processing Systems, 35</i>, 27730–27744. https://arxiv.org/abs/2203.02155',
    short:'Training Models to Follow Instructions (InstructGPT)',line:'Human demonstrations and rankings steer a base model toward what people actually asked for.',lvl:[8,13]},
  hoffmann2022:{y:2022,a1:'Hoffmann et al.',an:'Hoffmann et al.',era:'language',
    apa:'Hoffmann, J., Borgeaud, S., Mensch, A., Buchatskaya, E., Cai, T., Rutherford, E., de Las Casas, D., Hendricks, L. A., Welbl, J., Clark, A., Hennigan, T., Noland, E., Millican, K., van den Driessche, G., Damoc, B., Guy, A., Osindero, S., Simonyan, K., Elsen, E., . . . Sifre, L. (2022). <i>Training compute-optimal large language models</i> (arXiv:2203.15556). arXiv. https://arxiv.org/abs/2203.15556',
    short:'Training Compute-Optimal LLMs (Chinchilla)',line:'For a fixed budget, grow the model and the training data together.',lvl:[6]},
  wang2023:{y:2023,a1:'Wang et al.',an:'Wang et al.',era:'tuning',
    apa:'Wang, X., Wei, J., Schuurmans, D., Le, Q. V., Chi, E. H., Narang, S., Chowdhery, A., & Zhou, D. (2023). Self-consistency improves chain of thought reasoning in language models. <i>International Conference on Learning Representations</i>. https://arxiv.org/abs/2203.11171',
    short:'Self-Consistency',line:'Sample many reasoning paths and take the majority answer.',lvl:[7,9]},
  moradi2025:{y:2025,a1:'Moradi et al.',an:'Moradi et al.',era:'now',
    apa:'Moradi, M., Yan, K., Colwell, D., Samwald, M., & Asgari, R. (2025). A critical review of methods and challenges in large language models. <i>Computers, Materials & Continua, 82</i>(2), 1681–1698. https://doi.org/10.32604/cmc.2025.061263',
    short:'A Critical Review of LLMs',line:'Training, tuning, alignment, RAG and the ethical limits, in one review.',lvl:[10,13]},
  kang2026:{y:2026,a1:'Kang & Li',an:'Kang and Li',era:'now',
    apa:'Kang, C., & Li, K. (2026). A lifecycle-oriented survey of LLM-based agents: Workflow, graph augmentation, and future directions. <i>Neurocomputing, 704</i>, Article 134838. https://doi.org/10.1016/j.neucom.2026.134838',
    short:'Lifecycle Survey of LLM-Based Agents',line:'Agents as iterative systems: priors, tools, memory, perception, planning, feedback.',lvl:[11]},
  haidemariam2026:{y:2026,a1:'Haidemariam',an:'Haidemariam',era:'now',
    apa:'Haidemariam, T. (2026). From the logic of coordination to goal-directed reasoning: The agentic turn in artificial intelligence. <i>Frontiers in Artificial Intelligence, 8</i>, Article 1728738. https://doi.org/10.3389/frai.2025.1728738',
    short:'The Agentic Turn in AI',line:'Agentic AI as loops that perceive, evaluate, update goals and act.',lvl:[11]},
  abbas2026:{y:2026,a1:'Abbas & Wang',an:'Abbas and Wang',era:'now',
    apa:'Abbas, M., & Wang, R.-Z. (2026). A survey on adversarial deep learning in computer vision. <i>IEEE Open Journal of the Computer Society, 7</i>, 1344–1363. https://doi.org/10.1109/OJCS.2026.3714544',
    short:'Adversarial Deep Learning in Vision',line:'Tiny, invisible nudges can flip a confident prediction.',lvl:[13]}
};
Object.keys(REFS).forEach(k=>REFS[k].k=k);
const ERA_NAMES={roots:'The roots',learning:'Learning from data',language:'Language machines',tuning:'Tuning and tools',now:'Right now'};
const citeText=(k,pg)=>{const r=REFS[k];return r?`${r.a1}, ${r.yt||r.y}${pg?', '+pg:''}`:k};
function citeHTML(spec,narr){
  const [ks,pg]=spec.split('|');const keys=ks.split(',').map(s=>s.trim()).filter(k=>REFS[k]);
  if(!keys.length)return '';
  keys.sort((a,b)=>REFS[a].a1.localeCompare(REFS[b].a1));
  if(narr){const r=REFS[keys[0]];return `<cite class="n" data-ref="${keys.join(',')}" tabindex="0" role="button">${esc(r.an)} (${r.yt||r.y})</cite>`}
  return `<cite class="c" data-ref="${keys.join(',')}" tabindex="0" role="button">(${keys.map(k=>citeText(k,pg)).join('; ')})</cite>`;
}
/* GLOSSARY: filled by the glossary content file; [[term]] looks up here. */
const GLOSS={};
const termKey=t=>t.toLowerCase().replace(/[^a-z0-9]+/g,'');
function rich(s){
  if(s==null)return '';
  return String(s)
    .replace(/\{\{c:([^}]+)\}\}/g,(_,spec)=>citeHTML(spec,false))
    .replace(/\{\{n:([^}]+)\}\}/g,(_,spec)=>citeHTML(spec,true))
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,(_,t,shown)=>`<span class="term" data-term="${esc(termKey(t))}" tabindex="0" role="button">${shown||t}</span>`)
    .replace(/\{\{fake\}\}/g,'<span class="fake">FICTIONAL</span>');
}
/* the references a chunk of html cites, in alphabetical (APA) order */
function refsIn(htmlStr){
  const set=new Set();(htmlStr.match(/data-ref="([^"]+)"/g)||[]).forEach(m=>m.slice(10,-1).split(',').forEach(k=>REFS[k]&&set.add(k)));
  return [...set].sort((a,b)=>REFS[a].apa.replace(/<[^>]+>/g,'').localeCompare(REFS[b].apa.replace(/<[^>]+>/g,'')));
}
