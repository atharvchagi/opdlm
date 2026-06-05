import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LinkButtons from "@/components/LinkButtons";
import Section from "@/components/Section";
import CodeBlock from "@/components/CodeBlock";
import ResultCard from "@/components/ResultCard";
import ResultsTable from "@/components/ResultsTable";
import FigureBlock from "@/components/FigureBlock";
import CitationBlock from "@/components/CitationBlock";
import TableOfContents from "@/components/TableOfContents";
import Footer from "@/components/Footer";

const generalPurposeColumns = [
  { key: "benchmark", label: "Benchmark", align: "left" as const },
  { key: "sdar4", label: "SDAR-4B", align: "center" as const },
  { key: "opdlm4", label: "OPDLM-4B", align: "center" as const },
  { key: "llada8", label: "LLaDA-8B", align: "center" as const },
  { key: "dream7", label: "Dream-7B", align: "center" as const },
  { key: "sdar8", label: "SDAR-8B", align: "center" as const },
  { key: "fast7", label: "Fast-dLLM-v2-7B", align: "center" as const },
  { key: "opdlm8", label: "OPDLM-8B", align: "center" as const },
];

const zeroShotColumns = [
  { key: "benchmark", label: "Benchmark", align: "left" as const },
  { key: "opdlm4", label: "OPDLM-4B", align: "center" as const },
  { key: "opdlm4Think", label: "OPDLM-4B think@eval", align: "center" as const },
  { key: "opdlm8", label: "OPDLM-8B", align: "center" as const },
  { key: "opdlm8Think", label: "OPDLM-8B think@eval", align: "center" as const },
];

const multilingualColumns = [
  { key: "benchmark", label: "Benchmark", align: "left" as const },
  { key: "sdar4", label: "SDAR-4B", align: "center" as const },
  { key: "opdlm4", label: "OPDLM-4B", align: "center" as const },
  { key: "fast7", label: "Fast-dLLM-v2-7B", align: "center" as const },
  { key: "sdar8", label: "SDAR-8B", align: "center" as const },
  { key: "opdlm8", label: "OPDLM-8B", align: "center" as const },
];

const specializedColumns = [
  { key: "model", label: "Model", align: "left" as const },
  { key: "gsm8k", label: "GSM8K", align: "center" as const },
  { key: "math500", label: "MATH-500", align: "center" as const },
  { key: "aime24", label: "AIME-24", align: "center" as const },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />

      <main className="max-w-wide mx-auto px-5 sm:px-8">
        <Hero />
        <LinkButtons />

        <div className="flex gap-0 xl:gap-12 items-start">
          <div className="flex-1 min-w-0">
          
            <Section id="motivation" title="Motivation">
              <p className="text-base font-sans text-ink/80 leading-relaxed mb-4">
                Pretraining a diffusion language model (DLM) from scratch is expensive, and
                existing open DLMs still trail autoregressive language models (ARLMs) of
                comparable scale on standard benchmarks. Rather than start over, we ask
                whether the capabilities already learned by a pretrained ARLM can be
                transferred to a DLM. A natural candidate is on-policy distillation (OPD),
                which supervises a student on its own rollouts and has proven effective in post-training. 
                This motivates the central research question of our work:
              </p>
              <blockquote className="border-l-4 border-ink/30 pl-4 italic text-base font-sans text-ink/90 leading-relaxed mb-4">
                Can we convert a pretrained ARLM into a DLM while preserving its prior?
                And can OPD do it?
              </blockquote>
              <p className="text-base font-sans text-ink/80 leading-relaxed mb-4">
                Applying OPD here runs into a chicken-and-egg problem, i.e, the teacher needs to
                be a capable DLM in order to score the masked, partially masked states the
                student visits, but a capable DLM is exactly what we are trying to build.
                OPDLM bypasses this by querying the ARLM directly as the teacher, reading
                out its prior through causal prefixes of the student's rollouts. This gives
                a self-distillation setup:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-base font-sans text-ink/80 leading-relaxed">
                <li>
                  <strong>Teacher:</strong> the frozen pretrained ARLM, queried only for
                  token-level distributions over causal clean blocks. 
                </li>
                <li>
                  <strong>Student:</strong> a block-diffusion LM initialized from the same
                  ARLM weights, trained to predict masked tokens under blockwise bidirectional attention.
                </li>
              </ul>
            </Section>
            
            <Section id="how-opdlm-works" title="How OPDLM Works">
              <FigureBlock
                src="/figures/opdlm_framework_v1.png"
                alt="OPDLM training step framework diagram"
                caption="At each training step, the student DLM samples a reverse trajectory, a partially denoised state is selected, and masked-token predictions are aligned with frozen ARLM teacher distributions."
              />

              <ol className="list-decimal pl-5 space-y-3 text-base font-sans text-ink/80 leading-relaxed mb-6">
                <li>
                  <strong>Roll out the student:</strong> sample a reverse unmasking trajectory from
                  the current DLM and fixed sampler.
                </li>
                <li>
                  <strong>Select an on-policy state:</strong> choose a non-terminal partially
                  denoised state from the realized trajectory.
                </li>
                <li>
                  <strong>Query the ARLM teacher:</strong> build causal prefixes from the terminal
                  sequence and retrieve token-level teacher distributions.
                </li>
                <li>
                  <strong>Optimize KL:</strong> align the DLM prediction at masked positions with
                  the frozen ARLM distribution.
                </li>
              </ol>

              <h3 className="text-xl font-sans font-semibold text-ink mb-3">
                Rollout-Length Curriculum
              </h3>
              <p className="text-base font-sans text-ink/80 leading-relaxed">
                Early in training, the terminal sequences the student generates by running its reverse diffusion process are low-quality, since the converted student is being queried with masked-token inputs and blockwise bidirectional attention for the first time. 
                To address this, OPDLM begins by generating shorter sequences and gradually increases their length, helping training stability and convergence.
              </p>
            </Section>

            <section id="highlights" className="py-10 border-t border-border">
              <h2 className="font-sans font-semibold text-ink mb-5 text-2xl">
                Key Highlights
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <ResultCard
                  metric="Efficiency Frontier"
                  value="0.066B"
                  comparison="4.2e18 FLOPs"
                  description="OPDLM-8B AIME-24 run from Figure 1"
                  highlight
                />
                <ResultCard
                  metric="Token Reduction"
                  value="15x-7,000x"
                  description="Compared with established AR-to-DLM baselines"
                />
                <ResultCard
                  metric="Zero-Shot Thinking"
                  value="18.6"
                  comparison="OPDLM-8B AIME-24"
                  description="Think@eval without explicit thinking training"
                />
                <ResultCard
                  metric="Specialized Math"
                  value="50.0"
                  comparison="AIME-24"
                  description="OPDLM-MATH-8B-Thinking"
                />
              </div>
              <p className="mt-5 text-sm font-sans text-ink/70 leading-relaxed">
                OPDLM-8B defines a new AIME-24 Pareto point: 0.066B training tokens and 4.2e18
                FLOPs, or 15x to 7,000x less training than established DLMs converted from ARLMs.
              </p>
            </section>

            <Section id="results" title="Results">
              <h3 className="text-xl font-sans font-semibold text-ink mb-3">
                General-Purpose DLM Results
              </h3>
              <p className="text-base font-sans text-ink/80 mb-4 leading-relaxed">
                OPDLM converts Qwen3 into a diffusion language model for general-purpose
                reasoning across knowledge, mathematics, science, and code. OPDLM-4B and OPDLM-8B reach performance
                competitive with existing DLMs while training on only 0.076B and 0.066B
                tokens, orders of magnitude fewer than the baselines, and at substantially
                lower FLOPs.
              </p>
              <ResultsTable
                columns={generalPurposeColumns}
                rows={[
                  { benchmark: "Training tokens", sdar4: "55B", opdlm4: "0.076B", llada8: "1500B", dream7: "580B", sdar8: "55B", fast7: "1B", opdlm8: "0.066B" },
                  { benchmark: "FLOPs (1e18)", sdar4: "1320", opdlm4: "2.4", llada8: "72000", dream7: "24360", sdar8: "2640", fast7: "42", opdlm8: "4.2" },
                  { sectionLabel: "General Knowledge & Instruction Following" },
                  { benchmark: "MMLU", sdar4: "74.9", opdlm4: "65.5", llada8: "65.5", dream7: "67.0", sdar8: "78.6", fast7: "66.6", opdlm8: "70.9" },
                  { benchmark: "MMLU-Pro", sdar4: "50.9", opdlm4: "46.3", llada8: "37.0", dream7: "43.3", sdar8: "56.9", fast7: "41.5", opdlm8: "53.7" },
                  { benchmark: "GPQA-Diamond", sdar4: "33.0", opdlm4: "29.1", llada8: "31.8", dream7: "32.1", sdar8: "40.2", fast7: "27.3", opdlm8: "36.1" },
                  { benchmark: "IFEval", sdar4: "56.6", opdlm4: "53.8", llada8: "59.9", dream7: "62.5", sdar8: "61.4", fast7: "65.4", opdlm8: "50.1" },
                  { benchmark: "CEval", sdar4: "62.9", opdlm4: "66.9", llada8: "-", dream7: "-", sdar8: "70.2", fast7: "70.3", opdlm8: "73.3" },
                  { benchmark: "LiveBench", sdar4: "25.3", opdlm4: "27.8", llada8: "-", dream7: "-", sdar8: "28.6", fast7: "9.5", opdlm8: "25.8" },
                  { sectionLabel: "Mathematics & Reasoning" },
                  { benchmark: "GSM8K", sdar4: "89.9", opdlm4: "87.6", llada8: "78.6", dream7: "81.0", sdar8: "91.3", fast7: "83.7", opdlm8: "87.1" },
                  { benchmark: "MATH-500", sdar4: "72.8", opdlm4: "72.8", llada8: "26.6", dream7: "39.2", sdar8: "78.6", fast7: "65.6", opdlm8: "71.2" },
                  { benchmark: "AIME-24", sdar4: "10.0", opdlm4: "14.4", llada8: "2.1", dream7: "0.0", sdar8: "10.0", fast7: "10.0", opdlm8: "14.7" },
                  { benchmark: "AIME-25", sdar4: "7.5", opdlm4: "12.6", llada8: "0.4", dream7: "0.0", sdar8: "10.0", fast7: "0.0", opdlm8: "12.4" },
                  { benchmark: "LMB-Hard", sdar4: "6.9", opdlm4: "11.1", llada8: "-", dream7: "-", sdar8: "8.9", fast7: "8.9", opdlm8: "20.0" },
                  { benchmark: "ZebraLogic", sdar4: "6.3", opdlm4: "10.5", llada8: "-", dream7: "-", sdar8: "7.8", fast7: "3.5", opdlm8: "12.9" },
                  { sectionLabel: "Code Generation" },
                  { benchmark: "HumanEval-base", sdar4: "76.8", opdlm4: "56.1", llada8: "35.4", dream7: "57.9", sdar8: "82.3", fast7: "63.4", opdlm8: "59.8" },
                  { benchmark: "MBPP-base", sdar4: "80.7", opdlm4: "57.7", llada8: "31.5", dream7: "68.3", sdar8: "79.6", fast7: "63.0", opdlm8: "48.7" },
                  { benchmark: "LCB-v6", sdar4: "12.6", opdlm4: "10.4", llada8: "-", dream7: "-", sdar8: "14.5", fast7: "9.7", opdlm8: "9.7" },
                  { benchmark: "Codeforces", sdar4: "4.0", opdlm4: "5.0", llada8: "-", dream7: "-", sdar8: "5.8", fast7: "5.0", opdlm8: "3.5" },
                ]}
                caption="OPDLM-4B and OPDLM-8B achieve competitive performance across general knowledge, math, and code while using as little as 0.066B-0.076B training tokens."
                highlightColumns={["opdlm4", "opdlm8"]}
                dividerBeforeColumn="llada8"
                compact
              />

              <h3 className="text-xl font-sans font-semibold text-ink mt-9 mb-3">
                Zero-Shot Results
              </h3>
              <h4 className="text-sm font-sans font-semibold uppercase tracking-widest text-muted mb-2">
                Zero-Shot Extended Thinking
              </h4>
              <p className="text-base font-sans text-ink/80 mb-4 leading-relaxed">
                Modern ARLMs can reason through a problem inside a{" "}
                <code>&lt;think&gt;...&lt;/think&gt;</code> trace before committing to an
                answer. We never train OPDLM to do this, yet the converted DLM does it
                zero-shot: when prompted to think, OPDLM-8B improves on the hardest reasoning
                benchmarks, raising AIME-24 from 14.7 to 18.6 and AIME-25 from 12.4 to 19.4.
                The base ARLM's reasoning ability survives on-policy conversion intact,
                emerging as a capability we never explicitly trained for.
              </p>
              <ResultsTable
                columns={zeroShotColumns}
                rows={[
                  { benchmark: "GSM8K", opdlm4: "87.6", opdlm4Think: "85.3", opdlm8: "87.1", opdlm8Think: "88.0" },
                  { benchmark: "MATH-500", opdlm4: "72.8", opdlm4Think: "75.0", opdlm8: "71.2", opdlm8Think: "75.6" },
                  { benchmark: "AIME-24", opdlm4: "14.4", opdlm4Think: "11.2", opdlm8: "14.7", opdlm8Think: "18.6" },
                  { benchmark: "AIME-25", opdlm4: "12.6", opdlm4Think: "13.6", opdlm8: "12.4", opdlm8Think: "19.4" },
                  { benchmark: "LMB-Hard", opdlm4: "11.1", opdlm4Think: "17.8", opdlm8: "20.0", opdlm8Think: "17.8" },
                  { benchmark: "ZebraLogic", opdlm4: "10.5", opdlm4Think: "9.5", opdlm8: "12.9", opdlm8Think: "17.3" },
                ]}
                caption={
                  <>
                    <strong>OPDLM retains ARLM priors</strong> for{" "}
                    <strong>zero-shot extended thinking</strong>,{" "}
                    <strong>despite that behavior not being explicitly included in OPDLM training.</strong>
                  </>
                }
                highlightColumns={["opdlm8", "opdlm8Think"]}
                dividerBeforeColumn="opdlm8"
              />

              <h4 className="text-sm font-sans font-semibold uppercase tracking-widest text-muted mt-7 mb-2">
                Multilingual Results
              </h4>
              <p className="text-base font-sans text-ink/80 mb-4 leading-relaxed">
                OPDLM keeps the multilingual ability of the base ARLM after conversion.
                without any multilingual-specific training. It holds performance across
                MMMLU-lite, INCLUDE-lite, and MLogiQA, and even improves on multilingual
                Math (MT-AIME 2024).
              </p>
              <ResultsTable
                columns={multilingualColumns}
                rows={[
                  { benchmark: "MMMLU-lite", sdar4: "50.7", opdlm4: "51.6", fast7: "51.5", sdar8: "60.8", opdlm8: "56.0" },
                  { benchmark: "INCLUDE-lite", sdar4: "53.3", opdlm4: "49.6", fast7: "45.1", sdar8: "57.8", opdlm8: "51.9" },
                  { benchmark: "MT-AIME 2024", sdar4: "3.0", opdlm4: "5.3", fast7: "4.3", sdar8: "4.0", opdlm8: "7.9" },
                  { benchmark: "MLogiQA", sdar4: "46.5", opdlm4: "46.5", fast7: "42.6", sdar8: "46.3", opdlm8: "42.0" },
                ]}
                caption="OPDLM preserves multilingual ability from the base ARLM after on-policy conversion."
                highlightColumns={["opdlm4", "opdlm8"]}
                dividerBeforeColumn="fast7"
              />

              <h3 className="text-xl font-sans font-semibold text-ink mt-9 mb-3">
                Specialized DLM Results
              </h3>
              <p className="text-base font-sans text-ink/80 mb-4 leading-relaxed">
                Since OPDLM is a form of post-training applied to ARLMs, we can also build
                specialized DLMs. Below, we train OPDLM specifically for math to obtain
                OPDLM-MATH, using the same on-policy distillation setup. Additionally, we train OPDLM-MATH-Thinking for extended reasoning. 
              </p>
              <ResultsTable
                columns={specializedColumns}
                rows={[
                  { sectionLabel: "Reference" },
                  { model: "SDAR-4B-Chat", gsm8k: "90.2", math500: "70.2", aime24: "5.0" },
                  { model: "LLaDA-8B-Instruct", gsm8k: "82.5", math500: "37.3", aime24: "0.5" },
                  { model: "Dream-7B-Instruct", gsm8k: "72.7", math500: "38.7", aime24: "0.0" },
                  { model: "SDAR-8B-Chat", gsm8k: "91.1", math500: "74.3", aime24: "11.8" },
                  { sectionLabel: "4B Scale" },
                  { model: "TraDo-4B-Instruct", gsm8k: "91.2", math500: "75.6", aime24: "8.3" },
                  { model: "OPDLM-MATH-4B", gsm8k: "83.8", math500: "75.8", aime24: "10.0", highlightRow: true },
                  { model: "OPDLM-MATH-4B-Thinking", gsm8k: "91.7", math500: "90.2", aime24: "43.3", highlightRow: true },
                  { sectionLabel: "8B Scale" },
                  { model: "TraDo-8B-Instruct", gsm8k: "92.3", math500: "78.5", aime24: "13.3" },
                  { model: "OPDLM-MATH-8B", gsm8k: "86.2", math500: "76.6", aime24: "23.3", highlightRow: true },
                  { model: "TraDo-8B-Thinking", gsm8k: "94.2", math500: "87.4", aime24: "35.5" },
                  { model: "OPDLM-MATH-8B-Thinking", gsm8k: "93.8", math500: "92.4", aime24: "50.0", highlightRow: true },
                ]}
                caption="Without RLVR or DLM pretraining, OPDLM-MATH performs competitively with baselines and is especially strong on harder math benchmarks; thinking variants are trained as separate models for extended reasoning."
              />
            </Section>

            <Section id="parallelization" title="Parallelization">
              <p className="text-base font-sans text-ink/80 leading-relaxed mb-5">
                We show two controls on inference throughput: lowering the decoding threshold lets
                OPDLM produce more tokens per denoising step, while the training block size sets the
                upper bound on the parallelism it can expose at inference time.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <FigureBlock
                  src="/math500_threshold_tokens_block4.png"
                  alt="Parallelization figure for threshold versus tokens per step at block size 4"
                  heightClass="h-[360px] md:h-[420px]"
                  caption={<strong>Lowering the decoding threshold increases tokens per step with an accuracy trade-off.</strong>}
                />
                <FigureBlock
                  src="/math500_blocksize_tokens_thr090.png"
                  alt="Parallelization figure for block size versus tokens per step at threshold 0.9"
                  heightClass="h-[360px] md:h-[420px]"
                  caption={<strong>At fixed gamma=0.9, larger block sizes increase tokens per step while trading off accuracy.</strong>}
                />
              </div>
            </Section>

            <Section id="quick-start" title="Quick Start">
              <p className="text-base font-sans text-ink/80 leading-relaxed mb-5">
                OPDLM converts a pretrained Qwen3 autoregressive model into a BD3LM
                student with on-policy distillation. Data and model artifacts are hosted in
                the{" "}
                <a
                  href="https://huggingface.co/collections/divelab/opdlm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent-strong underline decoration-accent-border underline-offset-2 hover:text-ink"
                >
                  divelab/opdlm
                </a>{" "}
                Hugging Face collection.
              </p>

              <h3 className="text-sm font-sans font-semibold uppercase tracking-widest text-muted mb-2">
                Environment
              </h3>
              <CodeBlock
                language="bash"
                code={`git clone <opdlm-repo-url>
cd opdlm

conda create -n opdlm python=3.10.19 -y
conda activate opdlm

# Install torch first.
pip install torch==2.6.0+cu124 --index-url https://download.pytorch.org/whl/cu124

# Install project dependencies.
pip install -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cu124

# Install flash-attn last so it builds against the active torch install.
pip install flash-attn==2.7.4.post1 --no-build-isolation`}
              />
              <p className="text-sm font-sans text-ink/70 leading-relaxed -mt-1 mb-5">
                If DeepSpeed rejects a CUDA 12.x minor-version mismatch while compiling CPU
                Adam, set <code className="font-mono text-ink">DS_SKIP_CUDA_CHECK=1</code>.
              </p>

              <h3 className="text-sm font-sans font-semibold uppercase tracking-widest text-muted mt-6 mb-2">
                Data
              </h3>
              <CodeBlock
                language="bash"
                code={`# Evaluation data: 19 of the 20 paper benchmarks.
huggingface-cli download divelab/opdlm_eval_data --local-dir data/ --repo-type dataset

# Training data: opdlm_train.json, 61,816 rows.
huggingface-cli download divelab/opdlm_train_data --local-dir data/ --repo-type dataset

# Paper eval and DAPO math data that live outside the OPDLM collection.
python data/prepare_codeforces.py
huggingface-cli download BytedTsinghua-SIA/DAPO-Math-17k --local-dir data/ --repo-type dataset`}
              />

              <h3 className="text-sm font-sans font-semibold uppercase tracking-widest text-muted mt-6 mb-2">
                Models
              </h3>
              <CodeBlock
                language="bash"
                code={`# Teacher ARLMs.
huggingface-cli download Qwen/Qwen3-4B --local-dir $HF_HOME/Qwen3-4B
huggingface-cli download Qwen/Qwen3-8B --local-dir $HF_HOME/Qwen3-8B

# Student initializations with bidirectional attention.
huggingface-cli download divelab/Qwen3-4B-a2d-init --local-dir $HF_HOME/Qwen3-4B-a2d-init
huggingface-cli download divelab/Qwen3-8B-a2d-init --local-dir $HF_HOME/Qwen3-8B-a2d-init`}
              />
              <p className="text-sm font-sans text-ink/70 leading-relaxed -mt-1 mb-5">
                Smaller <code className="font-mono text-ink">Qwen3-0.6B</code> and
                <code className="font-mono text-ink"> Qwen3-1.7B</code> init models can be
                regenerated with <code className="font-mono text-ink">convert_qwen_to_bd3lm.py</code>.
              </p>

              <h3 className="text-sm font-sans font-semibold uppercase tracking-widest text-muted mt-6 mb-2">
                Train
              </h3>
              <CodeBlock
                language="bash"
                code={`python rl.py config=configs/rl_bd3lm.yaml \\
    model.pretrained_model=$HF_HOME/Qwen3-4B-a2d-init \\
    model.teacher_model=$HF_HOME/Qwen3-4B \\
    dataset.train_dataset=opdlm_train`}
              />
              <p className="text-sm font-sans text-ink/70 leading-relaxed -mt-1 mb-5">
                Reference launchers with the paper hyperparameters live in
                <code className="font-mono text-ink"> scripts/general_pre_train/</code> and
                <code className="font-mono text-ink"> scripts/post_train_dapo/</code>. Edit
                <code className="font-mono text-ink"> DATA_PATH</code>,
                <code className="font-mono text-ink"> STUDENT</code>,
                <code className="font-mono text-ink"> TEACHER</code>, and the SBATCH header for
                your cluster.
              </p>

              <h3 className="text-sm font-sans font-semibold uppercase tracking-widest text-muted mt-6 mb-2">
                Evaluate
              </h3>
              <CodeBlock
                language="bash"
                code={`python pure_inference/eval.py \\
    --models <path-to-your-trained-opdlm-ckpt> \\
    --model_bases bd3lm \\
    --datasets HumanEval MBPP MATH500 GSM8K AIME2024 \\
    --max_token 2048 \\
    --remasking_strategy low_confidence_static \\
    --dynamic_threshold 0.9 \\
    --temperature 0.0 \\
    --block_size 4 --denoising_steps_per_block 4 \\
    --out_dir pure_inference/results`}
              />
            </Section>

            <Section id="citation" title="Citation">
              <CitationBlock />
            </Section>
          </div>

          <TableOfContents />
        </div>
      </main>

      <Footer />
    </div>
  );
}
