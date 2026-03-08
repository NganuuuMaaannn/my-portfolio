"use client";

import { useEffect, useState } from "react";
import type { NavItem } from "./types";
import { HeaderReveal } from "./PortfolioMotion";

type PortfolioHeaderProps = {
  navItems: NavItem[];
  onNavigate: (sectionId: string) => void;
};

export function PortfolioHeader({
  navItems,
  onNavigate,
}: PortfolioHeaderProps) {

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-6 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 px-4 transition-transform duration-300 ${showHeader ? "translate-y-0" : "-translate-y-32"
        }`}
    >
      <HeaderReveal delay={0.88}>
        <div className="flex justify-center items-center rounded-full border border-white/10 bg-slate-900/70 px-6 py-3 backdrop-blur-xl shadow-lg">
          <nav className="flex items-center gap-6 md:gap-12 text-sm md:text-lg font-medium text-slate-200 overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <div
                key={item.id}
                className="inline-block overflow-hidden"
              >
                <button
                  onClick={() => onNavigate(item.id)}
                  className="whitespace-nowrap transition-transform duration-300 transform hover:scale-105 hover:text-white"
                >
                  {item.label}
                </button>
              </div>
            ))}
          </nav>
        </div>
      </HeaderReveal>
    </header>
  );
}
