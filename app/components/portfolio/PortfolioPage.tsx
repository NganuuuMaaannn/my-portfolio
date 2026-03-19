"use client";

import { useEffect, useRef, useState } from "react";

import { normalizePortfolioContent } from "./data";
import type { PortfolioContent, PortfolioRow } from "./types";
import { AboutSection } from "./AboutSection";
import { BackToTopButton } from "./BackToTopButton";
import { CertificatesSection } from "./CertificatesSection";
import { ContactSection } from "./ContactSection";
import { HeroSection } from "./HeroSection";
import { PortfolioFooter } from "./PortfolioFooter";
import { PortfolioHeader } from "./PortfolioHeader";
import { PageIntroOverlay } from "./PortfolioMotion";
import { ProjectsSection } from "./ProjectsSection";
import { createClient } from "@/lib/supabase";

type PortfolioPageProps = {
  portfolio: PortfolioContent;
  enableRealtime?: boolean;
};

export function PortfolioPage({
  portfolio,
  enableRealtime = false,
}: PortfolioPageProps) {
  const scrollAnimationFrameRef = useRef<number | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [livePortfolio, setLivePortfolio] = useState(portfolio);

  useEffect(() => {
    setLivePortfolio(portfolio);
  }, [portfolio]);

  useEffect(() => {
    if (!enableRealtime) {
      return;
    }

    const supabase = createClient();
    const channel = supabase
      .channel(`portfolio:${portfolio.portfolioSlug}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "student_portfolios",
          filter: `portfolio_slug=eq.${portfolio.portfolioSlug}`,
        },
        (payload) => {
          if (!payload.new) {
            return;
          }

          setLivePortfolio(
            normalizePortfolioContent(payload.new as Partial<PortfolioRow>),
          );
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [enableRealtime, portfolio.portfolioSlug]);

  const animateScrollTo = (
    targetY: number,
    duration = 850,
    onComplete?: () => void,
  ) => {
    if (scrollAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(scrollAnimationFrameRef.current);
    }

    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startY + distance * easedProgress);

      if (progress < 1) {
        scrollAnimationFrameRef.current = window.requestAnimationFrame(step);
        return;
      }

      scrollAnimationFrameRef.current = null;
      onComplete?.();
    };

    scrollAnimationFrameRef.current = window.requestAnimationFrame(step);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) {
        return;
      }

      const footerSection = document.getElementById("page-footer");
      const footerInView = footerSection
        ? footerSection.getBoundingClientRect().top <= window.innerHeight
        : false;

      setShowBackToTop((previousValue) =>
        previousValue === footerInView ? previousValue : footerInView,
      );
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    const headerOffset = 96;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const targetY = Math.max(sectionTop - headerOffset, 0);

    isProgrammaticScrollRef.current = true;
    setShowBackToTop(false);

    animateScrollTo(targetY, 1100, () => {
      isProgrammaticScrollRef.current = false;
    });
  };

  const scrollToTop = () => {
    isProgrammaticScrollRef.current = true;
    setShowBackToTop(false);

    animateScrollTo(0, 1400, () => {
      isProgrammaticScrollRef.current = false;
    });
  };

  return (
    <main className="relative overflow-hidden pb-16 text-slate-100">
      <PageIntroOverlay />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_26%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_24%),linear-gradient(180deg,#050816_0%,#0b1120_46%,#111827_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 [bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)]] [bg-size-[72px_72px]]" />

      <PortfolioHeader navItems={livePortfolio.navItems} onNavigate={scrollToSection} />
      <HeroSection
        ownerName={livePortfolio.ownerName}
        headline={livePortfolio.headline}
        intro={livePortfolio.intro}
        roleTitle={livePortfolio.roleTitle}
        specialty={livePortfolio.specialty}
        heroStats={livePortfolio.heroStats}
        contactMethods={livePortfolio.contactMethods}
        onNavigate={scrollToSection}
      />
      <AboutSection
        ownerName={livePortfolio.ownerName}
        aboutBio={livePortfolio.aboutBio}
        roleTitle={livePortfolio.roleTitle}
        specialty={livePortfolio.specialty}
        capabilities={livePortfolio.capabilities}
      />
      <ProjectsSection projects={livePortfolio.projects} />
      <CertificatesSection certificates={livePortfolio.certificates} />
      <ContactSection
        ownerName={livePortfolio.ownerName}
        portfolioSlug={livePortfolio.portfolioSlug}
        contactMessage={livePortfolio.contactMessage}
        contactMethods={livePortfolio.contactMethods}
        onNavigate={scrollToSection}
      />
      <PortfolioFooter ownerName={livePortfolio.ownerName} />
      <BackToTopButton visible={showBackToTop} onClick={scrollToTop} />
    </main>
  );
}
