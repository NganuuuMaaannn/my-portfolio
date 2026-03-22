import Image from "next/image";
import { FaExternalLinkAlt } from "react-icons/fa";

import { SectionReveal, TileReveal } from "./PortfolioMotion";
import type { Certificate } from "./types";

type CertificatesSectionProps = {
  certificates: Certificate[];
};

const certificateCardGradientClasses = [
  "from-teal-400/5 via-slate-900/10 to-cyan-400/10",
  "from-sky-400/5 via-slate-900/10 to-indigo-400/10",
  "from-emerald-400/5 via-slate-900/10 to-teal-300/10",
  "from-amber-300/5 via-slate-900/10 to-orange-400/10",
  "from-rose-300/5 via-slate-900/10 to-fuchsia-400/10",
] as const;

const certificateCardGlowClasses = [
  "from-teal-300/5 via-cyan-300/10 to-transparent",
  "from-sky-300/5 via-indigo-300/10 to-transparent",
  "from-emerald-300/5 via-teal-300/10 to-transparent",
  "from-amber-200/5 via-orange-300/10 to-transparent",
  "from-rose-200/5 via-fuchsia-300/10 to-transparent",
] as const;

export function CertificatesSection({
  certificates,
}: CertificatesSectionProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SectionReveal
        id="certificates"
        className="mx-auto max-w-6xl scroll-mt-28 px-6 py-16 lg:px-8 lg:py-20"
        delay={0.06}
      >

        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-2xl font-semibold uppercase tracking-[0.26em] text-teal-200">
              Certificates
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 auto-cols-fr">
          {certificates.map((certificate, index) => {
            const cardGradientClass =
              certificateCardGradientClasses[index % certificateCardGradientClasses.length];
            const cardGlowClass =
              certificateCardGlowClasses[index % certificateCardGlowClasses.length];

            return (
              <TileReveal key={certificate.title} delay={0.06 + index * 0.07} className="h-full">
                <article
                  className={`relative flex h-full flex-col overflow-hidden rounded-4xl border border-white/10 bg-linear-to-br ${cardGradientClass} p-5 shadow-[0_18px_60px_rgba(2,6,23,0.36)] backdrop-blur transition hover:-translate-y-1 hover:border-teal-300/30`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-linear-to-br ${cardGlowClass} opacity-30`}
                  />
                  <div className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

                  <div className="relative z-10 h-full overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70">
                    <Image
                      src={certificate.image}
                      alt={certificate.title}
                      width={640}
                      height={420}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="relative z-10 mt-5 flex h-full flex-col">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      <span>{certificate.website}</span>
                      <span>{certificate.issued}</span>
                    </div>

                    <h3 className="mt-4 text-2xl font-semibold text-slate-50">
                      {certificate.title}
                    </h3>

                    <div className="mt-auto flex flex-col gap-2">
                      <div className="text-sm leading-7 text-slate-300">
                        <p>
                          <span className="font-semibold text-slate-50">Website:</span>{" "}
                          {certificate.website}
                        </p>
                      </div>

                      <a
                        href={certificate.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-100 transition hover:text-teal-300"
                      >
                        Open Certificate
                        <FaExternalLinkAlt className="text-xs" />
                      </a>
                    </div>
                  </div>
                </article>
              </TileReveal>
            );
          })}
        </div>
      </SectionReveal>
    </div>
  );
}
