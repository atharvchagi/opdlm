import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Data-Efficient AR-to-Diffusion Language Models",
  description:
    "A project page for OPDLM: Data-Efficient Autoregressive-to-Diffusion Language Models via On-Policy Distillation.",
  openGraph: {
    title: "Data-Efficient AR-to-Diffusion Language Models",
    description:
      "On-policy distillation for converting autoregressive language models into diffusion language models.",
    type: "article",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body>{children}</body>
    </html>
  );
}
