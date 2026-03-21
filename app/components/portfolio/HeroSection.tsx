"use client";

import type { ComponentType } from "react";
import {
  FaEnvelope,
  FaGithub,
  FaGlobe,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

import { findPrimaryEmail } from "./data";
import { revealEase, TileReveal } from "./PortfolioMotion";
import type { ContactIconName, ContactMethod, HeroContact, HeroStat } from "./types";

type HeroSectionProps = {
  ownerName: string;
  headline: string;
  intro: string;
  roleTitle: string;
  specialty: string;
  heroStats: HeroStat[];
  heroContacts: HeroContact[];
  contactMethods: ContactMethod[];
  onNavigate: (sectionId: string) => void;
};

const heroIconMap: Record<ContactIconName, ComponentType<{ className?: string }>> = {
  email: FaEnvelope,
  phone: FaPhoneAlt,
  location: FaMapMarkerAlt,
  linkedin: FaLinkedin,
  github: FaGithub,
  website: FaGlobe,
};

const resumePattern = /resume|cv|curriculum/i;

export function HeroSection({
  ownerName,
  roleTitle,
  specialty,
  heroContacts,
  contactMethods,
  onNavigate,
}: HeroSectionProps) {
  const primaryEmail = findPrimaryEmail(contactMethods);
  const resumeLink =
    contactMethods.find((item) =>
      resumePattern.test(`${item.label} ${item.value} ${item.href}`),
    ) ??
    contactMethods.find(
      (item) => item.icon === "website" && item.href.startsWith("http"),
    ) ??
    contactMethods.find((item) => item.icon === "linkedin") ??
    contactMethods.find((item) => item.icon === "github");

  const heroSubheading =
    specialty && specialty.length <= 40 ? `${roleTitle} | ${specialty}` : roleTitle;

  return (
    <div className="relative min-h-screen overflow-x-hidden text-slate-100">
      <section
        id="home"
        className="flex min-h-svh items-center overflow-hidden px-6 py-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="relative flex min-h-[calc(100svh-3rem)] flex-col items-center justify-center overflow-hidden sm:px-10">
            <div className="relative flex flex-col items-center text-center">
              <motion.h1
                className="mt-6 text-4xl font-extrabold uppercase tracking-[0.14em] text-slate-50 sm:text-6xl lg:text-6xl"
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.02, delay: 0.3, ease: revealEase }}
              >
                {ownerName}
              </motion.h1>

              <motion.div
                className="mt-6 space-y-2"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.88, delay: 0.42, ease: revealEase }}
              >
                <p className="text-lg font-medium text-slate-400 sm:text-2xl">
                  {heroSubheading}
                </p>
              </motion.div>

              <motion.div
                className="mt-10 flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.82, delay: 0.72, ease: revealEase }}
              >
                <a
                  href={resumeLink?.href || "#projects"}
                  target={resumeLink?.href?.startsWith("http") ? "_blank" : undefined}
                  rel={resumeLink?.href?.startsWith("http") ? "noreferrer" : undefined}
                  onClick={(event) => {
                    if (!resumeLink) {
                      event.preventDefault();
                      onNavigate("projects");
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-teal-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-300"
                >
                  View Resume
                </a>

                <a
                  href={primaryEmail?.href || "#contact"}
                  onClick={(event) => {
                    if (!primaryEmail) {
                      event.preventDefault();
                      onNavigate("contact");
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-teal-300/35 hover:bg-white/10"
                >
                  Contact Me
                </a>
              </motion.div>

              {heroContacts.length > 0 ? (
                <motion.div
                  className="mt-8 flex flex-wrap justify-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.82, delay: 0.82, ease: revealEase }}
                >
                  {heroContacts.map((item, index) => {
                    const Icon = heroIconMap[item.icon];
                    const external = item.href.startsWith("http");

                    return (
                      <TileReveal
                        key={`${item.label}-${index}`}
                        delay={0.86 + index * 0.05}
                      >
                        <a
                          href={item.href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noreferrer" : undefined}
                          aria-label={item.label}
                          title={item.label}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/6 text-lg text-slate-200 transition hover:-translate-y-0.5 hover:border-teal-300/35 hover:bg-white/10 hover:text-white"
                        >
                          <Icon />
                        </a>
                      </TileReveal>
                    );
                  })}
                </motion.div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
