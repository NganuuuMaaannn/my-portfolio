export function PortfolioFooter() {
  return (
    <footer id="page-footer" className="mx-auto max-w-6xl px-6 pt-8 lg:px-8">
      <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Sean Michael. Portfolio template with dummy content.</p>
        <p>Built with Next.js and Tailwind CSS.</p>
      </div>
    </footer>
  );
}
