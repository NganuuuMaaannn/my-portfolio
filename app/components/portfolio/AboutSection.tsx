import Image from "next/image";

import { SectionReveal, TileReveal } from "./PortfolioMotion";
import type { Capability } from "./types";

type AboutSectionProps = {
  ownerName: string;
  aboutBio: string;
  roleTitle: string;
  specialty: string;
  capabilities: Capability[];
};

export function AboutSection({
  ownerName,
  aboutBio,
  roleTitle,
  specialty,
  capabilities,
}: AboutSectionProps) {
  return (
    <SectionReveal
      id="about"
      className="mx-auto max-w-6xl scroll-mt-28 px-6 py-16 lg:px-8 lg:py-20"
      delay={0.04}
    >
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="rounded-[36px] border border-white/10 bg-slate-900/68 p-8 shadow-[0_24px_70px_rgba(2,6,23,0.32)] backdrop-blur sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-teal-200">
            About Me
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-50 sm:text-4xl">
            {ownerName} turns ideas into interfaces that feel intentional, useful, and easy to trust.
          </h2>
          <p className="mt-6 text-base leading-8 text-slate-300">{aboutBio}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 auto-rows-fr">
            {capabilities.map((item, index) => (
              <TileReveal key={`${item.title}-${index}`} delay={0.08 + index * 0.06}>
                <div className="flex h-full flex-col rounded-[28px] border border-white/10 bg-white/5 p-5">
                  <h3 className="text-lg font-semibold text-slate-50">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
                </div>
              </TileReveal>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-6 rounded-[38px] bg-orange-400/20 blur-3xl" />
          <div className="relative rounded-[36px] border border-white/10 bg-slate-900/65 p-6 shadow-[0_28px_90px_rgba(2,6,23,0.36)]">
            <Image
              src="/profile-portrait.svg"
              alt={`${ownerName} profile portrait placeholder`}
              width={720}
              height={840}
              className="aspect-4/5 w-full rounded-[28px] object-cover"
              priority
            />

            <div className="mt-5 grid gap-4 sm:grid-cols-2 auto-rows-fr">
              <TileReveal delay={0.16}>
                <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/6 px-5 py-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Role
                  </p>

                  <p className="mt-2 text-lg font-semibold text-slate-50">
                    {roleTitle}
                  </p>
                </div>
              </TileReveal>

              <TileReveal delay={0.22}>
                <div className="flex h-full flex-col rounded-3xl bg-slate-950 px-5 py-4 text-white shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                    Specialty
                  </p>

                  <p className="mt-2 text-lg font-semibold">{specialty}</p>
                </div>
              </TileReveal>
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
