import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LinkButtons from "@/components/LinkButtons";
import MediaHero from "@/components/MediaHero";
import Section from "@/components/Section";
import CodeBlock from "@/components/CodeBlock";
import ResultCard from "@/components/ResultCard";
import ResultsTable from "@/components/ResultsTable";
import FigureBlock from "@/components/FigureBlock";
import EquationBlock, { InlineMath } from "@/components/EquationBlock";
import CitationBlock from "@/components/CitationBlock";
import TableOfContents from "@/components/TableOfContents";
import Footer from "@/components/Footer";

const OPD_LOSS = String.raw`
\begin{aligned}
\mathcal{L}_{\mathrm{OPD}}(\theta)
&=
\mathbb{E}_{\hat{\mathbf{x}}\sim p_\theta}
\left[
\frac{1}{|\hat{\mathbf{x}}|}
\sum_{i=1}^{|\hat{\mathbf{x}}|}
D_{\mathrm{KL}}
\left(
p_\phi(\cdot\mid \hat{\mathbf{x}}_{<i})
\;\middle\|\;
p_\theta(\cdot\mid \hat{\mathbf{x}}_{<i})
\right)
\right].
\end{aligned}
`;

const OPDLM_LOSS = String.raw`
\begin{aligned}
\mathcal{L}_{\mathrm{OPDLM}}(\theta;\tau,t)
&=
\sum_{b=1}^{B}
\sum_{i\in\mathcal{M}(\mathbf{x}_t^b)}
D_{\mathrm{KL}}
\left(
p_{\mathrm{ARLM}}(\cdot\mid \mathbf{x}_0^{<b},\mathbf{x}_0^{b,<i})
\;\middle\|\;
p_\theta^{b,i}(\cdot\mid \mathbf{x}_0^{<b},\mathbf{x}_t^b)
\right)
\end{aligned}
`;

export default function Page() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />

      <main className="max-w-wide mx-auto px-5 sm:px-8">
        <Hero />
        <LinkButtons />

        <MediaHero caption="OPDLM training framework and AIME-24 efficiency frontier. Replace this placeholder with the final figure or video asset." />

        <div className="mb-2 max-w-content mx-auto">
          <p className="text-base font-sans text-ink/85 leading-relaxed mb-4">
            Autoregressive-to-diffusion conversion can avoid training diffusion language
            models from scratch, but existing conversion methods still face two problems:
            they can lose knowledge from the original ARLM, and they train on random masked
            states that differ from the reverse trajectories used at inference.
          </p>
          <p className="text-base font-sans text-ink/85 leading-relaxed">
            <strong>OPDLM</strong> converts an ARLM into a diffusion language model with{" "}
            <span className="underline decoration-accent-border underline-offset-4">
              on-policy distillation
            </span>
            . The student DLM trains on its own reverse diffusion
            trajectories, while the frozen original ARLM provides token-level supervision.
          </p>
        </div>

        <div className="flex gap-0 xl:gap-12 items-start">
          <div className="flex-1 min-w-0">
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

            <Section id="why-opdlm" title="Why OPDLM?">
              <p className="text-base font-sans text-ink/80 leading-relaxed mb-4">
                Diffusion language models decode by following sampler-induced reverse unmasking
                trajectories, often with confidence-guided decoding heuristics. Standard
                forward-masking training does not directly represent those inference states, so
                conversion has to solve two problems at once: preserve the pretrained ARLM's
                knowledge and train the DLM on the states it will actually visit.
              </p>
              <p className="text-base font-sans text-ink/80 leading-relaxed mb-4">
                On-policy distillation is a natural fit in spirit: supervise a student on states
                sampled from its own generation process. But a direct application would require a
                DLM teacher that can score partially masked diffusion states, which is exactly the
                expensive pretraining requirement conversion is meant to avoid.
              </p>
              <p className="text-base font-sans text-ink/80 leading-relaxed mb-6">
                OPDLM resolves this by initializing the DLM student from the ARLM checkpoint,
                rolling out the student's own reverse diffusion trajectories, and distilling
                token-level targets from the original frozen ARLM. This makes ARLM-to-DLM
                conversion an efficient post-training procedure rather than a new DLM pretraining
                run.
              </p>

              <ResultsTable
                columns={[
                  { key: "model", label: "Model", align: "left" },
                  { key: "tokens", label: "Tokens", align: "center" },
                  { key: "flops", label: "FLOPs", align: "center" },
                  { key: "aime24", label: "AIME-24", align: "center" },
                ]}
                rows={[
                  { model: "LLaDA-8B", modelHref: "https://arxiv.org/abs/2502.09992", tokens: "1500B", flops: "72000e18", aime24: "2.1" },
                  { model: "Dream-7B", modelHref: "https://arxiv.org/pdf/2508.15487", tokens: "580B", flops: "24360e18", aime24: "0.0" },
                  { model: "Fast-dLLM-v2-7B", modelHref: "https://arxiv.org/abs/2509.26328", tokens: "1B", flops: "42e18", aime24: "10.0" },
                  { model: "OPDLM-8B", tokens: "0.076B", flops: "4.9e18", aime24: "20.0" },
                ]}
                caption="Condensed from the paper's main efficiency table."
                highlightColumn="tokens"
              />
            </Section>

            <Section id="how-opdlm-works" title="How OPDLM Works">
              <h3 className="text-xl font-sans font-semibold text-ink mb-3">
                The OPD Template
              </h3>
              <p className="text-base font-sans text-ink/80 leading-relaxed mb-4">
                In autoregressive on-policy distillation, the student first samples a sequence
                from its own model. The teacher is then queried on prefixes from that same sampled
                sequence, and the student is trained to match the teacher's next-token distribution
                on those prefixes.
              </p>
              <EquationBlock
                label="On-policy distillation for ARLMs"
                latex={OPD_LOSS}
                caption={
                  <>
                    Here, <InlineMath latex={String.raw`\hat{\mathbf{x}}`} /> is the student's
                    sampled sequence, <InlineMath latex={String.raw`p_\phi`} /> is the teacher,{" "}
                    <InlineMath latex={String.raw`p_\theta`} /> is the student, and the KL term
                    compares their next-token distributions at each prefix.
                  </>
                }
              />
              <p className="text-base font-sans text-ink/80 leading-relaxed mb-6">
                OPDLM applies the same principle to diffusion conversion: train on states produced
                by the student's own generation process. The difference is that a DLM's states are
                partially masked reverse-unmasking states, not causal prefixes.
              </p>

              <h3 className="text-xl font-sans font-semibold text-ink mb-3">
                One OPDLM Rollout
              </h3>
              <p className="text-base font-sans text-ink/80 leading-relaxed mb-4">
                For each training step, the current DLM student samples a reverse unmasking
                rollout with the same sampler used at inference. From that rollout, OPDLM selects
                one non-terminal state <InlineMath latex={String.raw`\mathbf{x}_t`} />, where some
                tokens are still masked, and keeps the terminal generated sequence{" "}
                <InlineMath latex={String.raw`\mathbf{x}_0`} />.
              </p>
              <p className="text-base font-sans text-ink/80 leading-relaxed mb-4">
                The notation in the loss is local to this rollout:{" "}
                <InlineMath latex={String.raw`b`} /> indexes a block,{" "}
                <InlineMath latex={String.raw`\mathcal{M}(\mathbf{x}_t^b)`} /> is the set of masked
                positions in that block, and <InlineMath latex={String.raw`i`} /> is one masked
                position. <InlineMath latex={String.raw`\mathbf{x}_0^{<b}`} /> means the terminal
                sequence before block <InlineMath latex={String.raw`b`} />, and{" "}
                <InlineMath latex={String.raw`\mathbf{x}_0^{b,<i}`} /> means the tokens before
                position <InlineMath latex={String.raw`i`} /> inside that block.
              </p>
              <EquationBlock
                label="OPDLM loss for one selected rollout state"
                latex={OPDLM_LOSS}
                caption={
                  <>
                    For every still-masked token, the ARLM teacher sees an unmasked causal prefix
                    from <InlineMath latex={String.raw`\mathbf{x}_0`} />, while the DLM student
                    predicts from the selected partially masked state{" "}
                    <InlineMath latex={String.raw`\mathbf{x}_t`} />.
                  </>
                }
              />
              <p className="text-base font-sans text-ink/80 leading-relaxed mb-6">
                The loss is a sum of token-level KL terms. Each term asks the DLM student to match
                the frozen ARLM's distribution for a token that was masked in the selected diffusion
                state. This is how OPDLM gets both pieces at once: on-policy DLM states from the
                student rollout, and knowledge retention from the original ARLM teacher.
              </p>

              <h3 className="text-xl font-sans font-semibold text-ink mb-3">
                Training Step
              </h3>
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
                Early reverse rollouts can be noisy because the converted student is being queried
                with masked-token inputs and blockwise bidirectional attention for the first time.
                OPDLM starts with shorter rollouts and gradually increases rollout length, so the
                ARLM teacher is less often asked to supervise incoherent early terminal sequences.
              </p>
            </Section>

            <Section id="results" title="Results">
              <p className="text-base font-sans text-ink/80 leading-relaxed mb-7">
                OPDLM is evaluated as both a general-purpose DLM and a task-specific math DLM.
                The current page keeps a small subset of the paper tables as placeholders for a
                cleaner final results section.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <ResultCard
                  metric="Training Tokens"
                  value="0.076B"
                  comparison="OPDLM-8B"
                  description="Main general-purpose run"
                  highlight
                />
                <ResultCard
                  metric="Reduction"
                  value="15x-7,000x"
                  description="Compared with established DLM baselines"
                />
                <ResultCard
                  metric="MATH-500"
                  value="92.4"
                  comparison="8B Thinking"
                  description="Task-specific OPDLM-MATH"
                />
                <ResultCard
                  metric="AIME-24"
                  value="50.0"
                  comparison="8B Thinking"
                  description="Task-specific OPDLM-MATH"
                />
              </div>

              <FigureBlock
                placeholderLabel="Add results chart from Table 1 or Figure 1"
                caption="OPDLM establishes a strong data/FLOP efficiency point while remaining competitive on general knowledge, math, reasoning, and code benchmarks."
              />

              <ResultsTable
                columns={[
                  { key: "model", label: "Model", align: "left" },
                  { key: "tokens", label: "Tokens", align: "center" },
                  { key: "mmlu", label: "MMLU", align: "center" },
                  { key: "gsm8k", label: "GSM8K", align: "center" },
                  { key: "math500", label: "MATH-500", align: "center" },
                  { key: "aime24", label: "AIME-24", align: "center" },
                ]}
                rows={[
                  { model: "OPDLM-4B", tokens: "0.075B", mmlu: "65.9", gsm8k: "85.0", math500: "71.8", aime24: "20.0" },
                  { model: "OPDLM-8B", tokens: "0.076B", mmlu: "69.8", gsm8k: "88.0", math500: "72.0", aime24: "20.0" },
                  { model: "OPDLM-MATH-4B-Thinking", tokens: "8K math problems", mmlu: "-", gsm8k: "91.7", math500: "90.2", aime24: "43.3" },
                  { model: "OPDLM-MATH-8B-Thinking", tokens: "8K math problems", mmlu: "-", gsm8k: "93.8", math500: "92.4", aime24: "50.0" },
                ]}
                caption="Condensed result snapshot from Tables 1 and 5."
                highlightColumn="aime24"
              />
            </Section>

            <Section id="conclusion" title="Conclusion">
              <p className="text-base font-sans text-ink/80 leading-relaxed mb-4">
                OPDLM reframes ARLM-to-DLM conversion as an efficient post-training procedure.
                Instead of pretraining a DLM from scratch or relying only on off-policy random
                masking, it trains the converted student on its own reverse diffusion states.
              </p>
              <p className="text-base font-sans text-ink/80 leading-relaxed">
                The result is a practical path for adapting pretrained autoregressive models
                into diffusion language models, with reported 15x to 7,000x training-token
                reductions and strong performance across general and task-specific evaluations.
              </p>
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
