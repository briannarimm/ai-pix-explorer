# Paper notes (working file)

Facts pulled from `background-papers/`, with locations, so the in-app copy can be checked.
Each entry: key used in `src/js/data/refs.js`, then facts. Page numbers are the printed page of the source.

## abumostafa2012 — Abu-Mostafa (2012), Scientific American 307(1), 78–81
- ML = branch of CS that "enables computers to learn from experience"; take an existing data set, comb for patterns, use them to predict (p.78).
- Netflix Prize: first entry to beat in-house system by 10% wins $1 million; ~3 years; 100 million ratings of real data.
- Movies broken into long arrays of attributes (funny, complicated...); algorithm starts with random, nameless attributes and tunes them to match ratings (training phase). Attributes can be "subtle, even incomprehensible"; algorithm predicts, doesn't explain. Bank credit-approval story: banks must articulate a rationale (legal reason for interpretability).
- Final: BellKor's Pragmatic Chaos and The Ensemble tied at 10.06% improvement; BellKor submitted 20 min earlier and won.
- Supervised learning (labelled examples; white-blood-cell images), reinforcement learning (trial and error; gaits; Google clicks; tic-tac-toe corner move), unsupervised (clustering; "organize a library" by grouping similar books).
- Overfitting: gambler sees 10 alternating red/black spins, ~1 in 500 chance of random flip-flop 10 times in a row. "if you torture the data long enough, it will confess." Regularization keeps models simple; validate on data not in the training set (Netflix tested on a hidden set).
- "Machine learning does not create information; it gets the information from the data." Works only on problems with enough data. First question: "What data do you have?"
- Validation set known only to Netflix.

## tantawi2018 — Tantawi (2018), "Machine learning," in Franceschetti (Ed.), Principles of Programming & Coding, Salem Press, pp. 173–174
- ML: algorithms that let computer "display behavior learned from past experience, rather than human instruction." Examples: spam filters, OCR, news feeds.
- Perceptron: Frank Rosenblatt, 1957, pattern recognition, modeled on neural network. Minsky & Papert 1969 *Perceptrons* showed limits (some problems it couldn't learn). Research paused; 1980s multilayer perceptrons revived; Quinlan decision trees; SVMs (Vapnik & Cortes, 1995); naive Bayes (iFile spam filter, Rennie, 1996).
- Categories: supervised, unsupervised, semi-supervised, transduction, reinforcement, learning to learn. Data mining vs ML.

## mcculloch1943 — McCulloch & Pitts (1943), reprinted in Lewis (Ed.) (2021), Ideas That Created the Future, ch. 9 (Lewis's intro + paper)
- Neurons as switches: fire or not ("all-or-none"). Global clock; state at t+1 depends on inputs at t. Threshold: neuron fires if more than θ inputs fire, unless an inhibitory input is active. Networks of such neurons = "threshold logic" gates; network predicates equal expressible logic. Feedback loops ("circles") suggested to explain memory.
- Lewis intro: modeled the brain as a digital system; "poor model for the brain" but "had given birth ... to the sprawling field of neural computing." Kleene 1951 simplified it (finite automata, regular expressions). Lettvin et al. 1959 ("what the frog's eye tells the frog's brain") undercut it.
- McCulloch (1898–1969) neuroscientist; Pitts (1923–1969) self-taught logician; met at U. Chicago. (Keep biography light.)

## samuel1962 — Samuel (1962), Annals of the AAPSS 340, 10–20
- "Computers are giant morons, not giant brains" (p.13). Difference between telling a computer *how* vs *what* (p.13).
- Heuristic vs algorithm (p.14): algorithm guaranteed to give answer if you follow steps; heuristic explores "more or less arbitrarily chosen procedures ... in a rather incomplete fashion", clues, hunches.
- Two approaches (p.14): study the problem (aerodynamics) vs imitate the brain ("bird-watching"; Hebb, Rochester, Farley & Clark, Rosenblatt's Perceptron). Jet planes solve flight differently from birds.
- Perceptron-style: neurons all-or-none; learning = strengthening/weakening connections; training by reward and punishment; same device could learn English letters or Chinese or aerial map features (p.15).
- Minsky's five areas: Search, Pattern Recognition, Learning, Planning, Induction (p.15).
- Checkers (p.16): look-ahead search; exhaustive search would take "many centuries, perhaps more than the total age of the universe" even on the fastest conceivable computer. Hill-climbing; local peaks (West Hill, 380 ft, Garden City, vs Everest).
- Pattern recognition (p.17): two steps = (1) concepts/features (roundness, straightness) (2) assign weights to them. Machine learning = automatic test of weight assignment against performance + a mechanism to alter weights to maximize performance. Checkers program learns and "soon becomes able to beat the man who wrote the program" via memory, accuracy, speed. A checker master could still beat the best program.
- Paradox: need higher understanding to instruct than to execute. Intelligent machines as tools; "technological unemployment" > domination. "Artificial intelligence is neither a myth nor a threat to man."
- Cites Minsky 1961 (Steps Toward AI, Proc. IRE 49, 8–30) and Samuel 1959 (checkers, IBM J. Res. Dev. 3(3), 211).

## thomasian1963 — Thomasian (1963), "Foundations of information theory," in Zadeh (Ed.), Report on progress in information theory in the U.S.A., 1960–1963, IEEE Trans. Information Theory 9(4), 221–?
- Survey of work extending Shannon's 1948 theory. Memoryless channel: transition matrix P(y|x); mutual information I(Q,P) = H(X)+H(Y)−H(X,Y); capacity = max over input distributions Q of I(Q,P) (p.221). Compound channel (parameters unknown): capacity = max over Q of min over channels (p.222). Use only for a light "noisy channel / capacity" sidebar; the paper is highly technical.

## fu1982 — Fu (1982), "Pattern recognition for automatic visual inspection," Computer 15(12), 34–?
- Three families of pattern recognition (p.34–35): template matching (store a prototype per class; compare by correlation), decision-theoretic (feature vector; discriminant function; statistical rule), structural/syntactic (string/tree/graph of primitives; parsing). Template matching = special case of decision-theoretic.
- Template trouble: choosing templates and matching criterion when big variations/distortions expected ("rubber mask" flexible templates).
- Pixel-by-pixel inspection: master image P vs sensed image W, D(x,y)=W−P; if |D| > threshold then defect; "contextual information ... is ignored" (p.37). Feature inspection: F(W)−F(P).
- Use: contrast "hand-built features" era with learned embeddings.

## findler1964 — Findler (1964), "Machine learning from noisy information," Nature 204(4953), 103
- Decode Morse (dot, dash, intra-letter space, inter-letter space, inter-word space) using letter-frequency charts; average word length 4.49 letters (4,000 words); element frequencies f1=0.308, f2=0.198, f3=0.297, f4=0.155, f5=0.045.
- Spaces identified because two identical spaces never occur in sequence. Fit by minimizing chi-square between expected (population) letter frequencies and sample frequencies, by adjusting the equivalence table. Also digraph/trigraph frequencies with weights w1,w2,w3.
- Noise simulated by overwriting a percentage of elements at random; aim: find minimum redundancy needed at each noise level (Fig. 1: noise level vs minimum information content). "Irreducible error" may remain.
- Great link to "models learn frequencies of what already exists."

## persson1964 — Persson (1964), "An introduction to artificial intelligence," Ekonomisk Tidskrift 66(2), 88–112
- Working definition: design of machines whose behavior "would be labelled intelligent if observed in human activity" (p.88). Turing's imitation game (p.88–89).
- Micro-level (neural-net analogies: simple, often randomly connected components, trial and error) vs macro-level (specialised problem-solving units) (p.89).
- Game programs: Samuel's checkers; chess has about 10^120 strategies, exhaustive evaluation impossible (p.91); humans use selective search, ~100 alternatives (p.92). Shannon proposed limited-depth evaluation with a numerical value per position.
- Logic Theory Machine, GPS (means-ends), SAINT, SAD SAM, BASEBALL (question-answering from a stored handbook), SYNTHEX (answers by quoting a children's encyclopedia).
- Clarkson's trust-investment officer simulation: program chose almost exactly the same portfolio as the officer (p.97–98). (Lawyer-friendly example: trusts.)
- Heuristic definition (fn): any method that often (not always) leads to a solution by reducing search. Algorithm: guaranteed but possibly uneconomical.
- Learning defined (p.102): "the utilization of previous experience for the improvement of present performance." Rote learning vs generalization learning.
- Samuel's evaluation polynomial: 16 parameters chosen from 38 candidates; coefficients adjusted when the "backed-up" value differs from stored value (p.104–105). Checkers game tree ~10^40 paths.

## vaswani2017 — Vaswani et al. (2017), "Attention is all you need," NeurIPS 30 (arXiv:1706.03762)
- Transformer base: N=6 encoder and decoder layers, d_model=512, d_ff=2048, h=8 heads, d_k=d_v=64 (d_model/h). Dropout 0.1 (Sec. 3, 5.4). Big model: 6 layers, d_model 1024, d_ff 4096, 16 heads, ~213M parameters (Table 3).
- Scaled dot-product attention: softmax(QK^T/√d_k)V. Why scale: for large d_k dot products grow large, push softmax into regions of tiny gradients (Sec. 3.2.1).
- Multi-head: project to lower dims, run in parallel, concatenate; "total computational cost is similar to that of single-head attention with full dimensionality."
- Masking in decoder: illegal connections set to −∞ before softmax.
- Positional encoding: sinusoids, wavelengths in geometric progression 2π to 10000·2π; learned positional embeddings gave nearly identical results (Sec. 3.5).
- Embeddings multiplied by √d_model; embedding and pre-softmax matrix shared (Sec. 3.4).
- Complexity (Table 1): self-attention O(n²·d), O(1) sequential ops, O(1) max path length; recurrent O(n·d²), O(n), O(n).
- Results: WMT14 EN-DE 28.4 BLEU (big); EN-FR 41.8 BLEU after 3.5 days on 8 P100 GPUs (300K steps at 1.0 s/step); base model 100K steps = 12 hours. EN-DE data ≈4.5M sentence pairs, byte-pair vocab ≈37,000; EN-FR 36M sentences, 32,000 word-piece vocab; ≈25,000 source + 25,000 target tokens per batch.
- Figures 3–5 (appendix): attention visualizations on a sentence about the law never being perfect but its application needing to be just. Heads in layer 5 of 6 apparently do anaphora resolution for "its"; long-distance dependency "making ... more difficult". USE THIS SENTENCE (it is about the law).

## devlin2019 — Devlin et al. (2019), BERT, NAACL-HLT (arXiv:1810.04805)
- Pretrain deep bidirectional representations from unlabeled text, conditioning on left and right context in all layers; fine-tune with one extra output layer.
- Masked LM: mask 15% of WordPiece tokens at random; predict only the masked ones. Also next-sentence prediction. Left-to-right models can't be bidirectional since each word would "see itself."
- WordPiece, 30,000-token vocabulary; [CLS] and [SEP] tokens.
- BERT-base: L=12, H=768, A=12, 110M params; BERT-large: L=24, H=1024, A=16, 340M params. BERT-base sized to match OpenAI GPT; GPT uses constrained self-attention (each token attends only to the left).
- Ablation (Table 5): left-to-right without NSP hurts several tasks.

## kaplan2020 — Kaplan et al. (2020), scaling laws (arXiv:2001.08361)
- Test loss follows power laws in non-embedding parameters N, dataset tokens D, and compute C over more than seven orders of magnitude. L(N)=(N_c/N)^0.076, N_c≈8.8×10^13; L(D)=(D_c/D)^0.095, D_c≈5.4×10^13 tokens; L(C_min)=(C_c/C_min)^0.050 (Eq. 1.1–1.3, p.3–4).
- Architectural details like width/depth have minimal effect within a wide range.
- Larger models are more sample-efficient; compute-efficient training uses very large models on modest data, stopping well short of convergence. N_opt ∝ C^0.73 (Table 5).

## hoffmann2022 — Hoffmann et al. (2022), "Training compute-optimal LLMs" (Chinchilla) (arXiv:2203.15556; NeurIPS 35)
- Trained 400+ models, 70M to 16B+ parameters, on 5B–500B tokens. For compute-optimal training model size and tokens scale equally: each doubling of model size should double training tokens. Kaplan implied 10× compute → 5.5× model, 1.8× tokens.
- Chinchilla: 70B parameters on 1.4T tokens, same compute as Gopher (280B on 300B tokens); outperforms Gopher, GPT-3 (175B), Jurassic-1 (178B), Megatron-Turing NLG (530B). MMLU 67.5%, >7 points over Gopher. Smaller model also cheaper at inference.
- Table 1: LaMDA 137B/168B tokens; GPT-3 175B/300B; Jurassic 178B/300B; Gopher 280B/300B; MT-NLG 530B/270B; Chinchilla 70B/1.4T.
- Table 3 (Approach 1 compute-optimal): 400M → 1.92e19 FLOPs, 8.0B tokens; 1B → 1.21e20, 20.2B; 10B → 1.23e22, 205.1B; 67B → 5.76e23, 1.5T; 175B → 3.85e24, 3.7T; 280B → 9.90e24, 5.9T; 520B → 3.43e25, 11.0T; 1T → 1.27e26, 21.2T. (≈20 tokens per parameter.)
- Exponents a (N_opt ∝ C^a), b (D_opt ∝ C^b): approach 1: 0.50, 0.50; 2: 0.49, 0.51; 3: 0.46, 0.54; Kaplan: 0.73, 0.27 (Table 2).
- Parametric fit (Eq. 10): L̂(N,D) = E + A/N^0.34 + B/D^0.28, E=1.69, A=406.4, B=410.7. E ≈ entropy of natural text.
- Cost point: compute ≈ 6·N·D FLOPs (check: 6×70e9×1.4e12 = 5.9e23 ≈ 5.76e23).

## brown2020 — Brown et al. (2020), GPT-3, NeurIPS 33 (arXiv:2005.14165)
- 175B-parameter autoregressive LM, 10× any previous non-sparse LM; 96 layers, d_model 12,288, 96 heads (d_head 128); context n_ctx = 2048 tokens; all models trained on 300B tokens; batch 3.2M tokens (Table 2.1).
- In-context learning: task + demonstrations given purely as text, no gradient updates. Zero-, one-, few-shot (K typically 10–100 examples that fit in the 2048-token window). Few-shot disadvantage: usually worse than fine-tuned SOTA. Larger models make more efficient use of in-context information (Fig. 1.2).
- Byte-level BPE tokenizer reused from GPT-2 (built for almost entirely English data) — possible weakness for En→Ro translation.
- Training data contamination study (Common Crawl may contain test sets).
- Limitations (Sec. 5): samples can repeat themselves, lose coherence over long passages, contradict themselves and include non-sequiturs. Autoregressive only (no bidirectionality) may cost on fill-in-the-blank and compare-two-passages tasks.
- GPT-3 175B reliable on 2-digit arithmetic, usually on 3-digit (Fig. 3.10).

## ouyang2022 — Ouyang et al. (2022), InstructGPT, NeurIPS 35 (arXiv:2203.02155)
- Making LMs bigger doesn't make them follow user intent. Three steps: (1) supervised fine-tuning on human demonstrations (~13k prompts); (2) train a reward model on human rankings of outputs (~33k prompts); (3) optimize policy against RM with PPO (31k prompts). 40 contractors hired via screening test.
- Outputs of 1.3B InstructGPT preferred over 175B GPT-3 despite 100× fewer parameters. Hallucination on closed-domain tasks 21% vs 41% (GPT-3). ~25% fewer toxic outputs when prompted to be respectful; no significant bias improvement.
- "Alignment tax": regressions on some public NLP datasets; PPO-ptx mixes pretraining gradients to reduce it.
- Aligns to the stated preferences of a specific group (mostly the labelers and researchers), not to a broader notion of human values (Sec. 1).
- RM loss = −E log σ(r(x,y_w) − r(x,y_l)) over pairs (Eq. 1).

## wei2022 — Wei et al. (2022), chain-of-thought, NeurIPS 35 (arXiv:2201.11903)
- Chain of thought = intermediate reasoning steps in few-shot exemplars. PaLM 540B with eight CoT exemplars: GSM8K 57% vs 18% standard prompting; prior best 55%; fine-tuned GPT-3 175B 33% (Fig. 2).
- Emergent ability of scale: gains only with models of ~100B parameters; smaller models produce "fluent but illogical chains of thought".
- Benefits: allocates extra computation to harder problems; interpretable window into behavior (though fully characterizing computations is open).
- Tennis-ball example: Roger starts with 5 balls and buys 2 cans of 3 balls each → 11.

## wang2023 — Wang et al. (2023), self-consistency, ICLR (arXiv:2203.11171)
- Sample many diverse reasoning paths (temperature sampling; T=0.5, top-k 40 for UL2-20B/LaMDA-137B; T=0.7, k=40 for PaLM-540B; T=0.7 for GPT-3), parse each final answer, take the majority vote: argmax_a Σ 1(a_i = a). 40 samples per run, averaged over 10 runs.
- Gains over greedy CoT: GSM8K +17.9%, SVAMP +11.0%, AQuA +12.2%, StrategyQA +6.4%, ARC-challenge +3.9%.
- Majority vote ≈ normalized weighted sum (Table 1).

## lewis2020 — Lewis et al. (2020), RAG, NeurIPS 33 (arXiv:2005.11401)
- Pretrained models store knowledge in parameters ("parametric memory") but struggle to access it precisely, give provenance, or update it. RAG pairs a seq2seq generator (BART) with a dense-vector index of Wikipedia ("non-parametric memory") searched by a neural retriever (DPR).
- Wikipedia Dec 2018 dump split into disjoint 100-word chunks → 21M documents; FAISS index with HNSW; k ∈ {5,10} in training.
- RAG-Sequence: same document for the whole output; RAG-Token: different document per token; marginalize over top-k latent documents: p(y|x) ≈ Σ_z p_η(z|x) p_θ(y|x,z) (Sec. 2.1).
- Index hot-swapping: replace the index (2016 → 2018 dump) to update knowledge without retraining (Sec. 4.5; 82 world leaders test).
- People preferred RAG's generations over parametric-only BART as more factual and specific. Retrieval collapse noted in some tasks.

## han2021 — Han et al. (2021), "Pre-trained models: Past, present and future," AI Open 2, 225–250
- PTMs (BERT, GPT) are now the consensus backbone; knowledge stored in parameters then fine-tuned. History through transfer learning and self-supervised learning.
- Word2Vec/GloVe: one dense vector per word, can't handle polysemy ("bank" in "open a bank account" vs "on a bank of the river"); motivated contextual embeddings (ELMo etc.).
- Parameter size and pretraining data growing ~10× per year (Fig. 2b caption).
- Open: interpretability and reliability, adversarial attacks/defenses.

## moradi2025 — Moradi et al. (2025), critical review of LLMs, Computers, Materials & Continua 82(2), 1681–1698, doi:10.32604/cmc.2025.061263 (page range inferred from PDF; double-check)
- Evolution RNN → Transformer; in-context learning; fine-tuning (parameter-efficient); alignment with human preferences via RL and human feedback; RAG; ethical considerations (bias, privacy, security, transparency, environmental impact).
- Hallucination definition: models "confidently provide inaccurate responses without sufficient information"; RAG integrates external retrieval to improve factual accuracy; vector databases central to RAG.

## kang2026 — Kang & Li (2026), lifecycle survey of LLM-based agents, Neurocomputing 704, 134838, doi:10.1016/j.neucom.2026.134838
- LLM = "cognitive core" of agents that perceive, reason about goals, act. Lifecycle framework (Fig. 1): agents initialized with priors, equipped with tools and memory mechanisms, situated through perception, organized for planning and execution, improved through feedback. Iterative systems, not isolated modules.
- Open problems: insufficient grounding, inefficient reasoning, tool hallucination, security risks of persistent memory stores. Minor stochastic perturbations at intermediate steps can accumulate into compounding errors. Graph-augmented agents (relational structure for tool orchestration, memory, planning). Reasoning–acting cycle of ReAct. Dense retrieval for tool selection.

## haidemariam2026 — Haidemariam (2026), "From the logic of coordination to goal-directed reasoning: the agentic turn in AI," Frontiers in AI 8, 1728738, doi:10.3389/frai.2025.1728738
- Agentic AI: shift from optimizing externally specified objectives to systems that represent, evaluate and revise their own goals; recursive loops of perception, evaluation, goal-updating, action. Synthetic teleology; indicators: teleological coherence, adaptive recovery, reflective efficiency. Builds on coordination/delegation/self-regulation from agent-based process management. (Theory paper; use lightly and label as a conceptual argument.)

## abbas2026 — Abbas & Wang (2026), adversarial deep learning in computer vision survey, IEEE Open J. Computer Society 7, 1344–1363, doi:10.1109/OJCS.2026.3714544
- Adversarial examples: subtle, often imperceptible perturbations cause confident but incorrect classifications. FGSM: single step of ε·sign(∇_x J). Universal perturbations; transferability: examples crafted on a surrogate fool other models. White-box vs black-box attacks. Arms race between attacks and defenses; "universal robustness" unsolved.
- Use in Limits: brittleness is not about the topic being hard; small input changes flip outputs. Connects to prompt sensitivity (claim only what the paper supports: vision).
