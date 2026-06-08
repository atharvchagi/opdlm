const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="max-w-content mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-sans text-muted">
        <p>© {YEAR} OPDLM authors.</p>
        <div className="flex items-center gap-4">
          <a href="https://arxiv.org/abs/2606.06712" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">Paper</a>
          <a href="#citation" className="hover:text-ink transition-colors">Citation</a>
        </div>
      </div>
    </footer>
  );
}
