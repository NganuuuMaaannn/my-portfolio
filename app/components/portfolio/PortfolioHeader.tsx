import type { NavItem } from "./types";

type PortfolioHeaderProps = {
  navItems: NavItem[];
  onNavigate: (sectionId: string) => void;
};

export function PortfolioHeader({
  navItems,
  onNavigate,
}: PortfolioHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4 lg:px-8">
        <a
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            onNavigate("home");
          }}
          className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-50"
        >
          Sean - Portfolio
        </a>
        <div className="ml-auto flex items-center gap-5">
          <nav className="hidden items-center justify-end gap-6 text-sm font-medium text-slate-300 md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className="cursor-pointer transition hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
