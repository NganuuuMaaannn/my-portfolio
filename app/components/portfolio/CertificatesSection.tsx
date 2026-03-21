import Image from "next/image";
import { FaExternalLinkAlt } from "react-icons/fa";

import { SectionReveal, TileReveal } from "./PortfolioMotion";
import type { Certificate } from "./types";

type CertificatesSectionProps = {
  certificates: Certificate[];
};

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
          {certificates.map((certificate, index) => (
            <TileReveal key={certificate.title} delay={0.06 + index * 0.07} className="h-full">
              <article className="flex h-full flex-col rounded-4xl border border-white/10 bg-slate-900/66 p-5 shadow-[0_18px_60px_rgba(2,6,23,0.36)] backdrop-blur transition hover:-translate-y-1 hover:border-teal-300/30">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 h-full">
                  <Image
                    src={certificate.image}
                    alt={certificate.title}
                    width={640}
                    height={420}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mt-5 flex flex-col h-full">

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    <span>{certificate.website}</span>
                    <span>{certificate.issued}</span>
                  </div>

                  <h3 className="mt-4 text-2xl font-semibold text-slate-50">
                    {certificate.title}
                  </h3>

                  <div className="mt-3 space-y-2 text-sm leading-7 text-slate-300">
                    <p>
                      <span className="font-semibold text-slate-50">Website:</span>{" "}
                      {certificate.website}
                    </p>

                    <p className="break-all">
                      <span className="font-semibold text-slate-50">Link:</span>{" "}
                      {certificate.href}
                    </p>
                  </div>

                  {/* Push button to bottom */}
                  <a
                    href={certificate.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-slate-100 transition hover:text-teal-300"
                  >
                    Open certificate
                    <FaExternalLinkAlt className="text-xs" />
                  </a>

                </div>

              </article>
            </TileReveal>
          ))}
        </div>
      </SectionReveal>
    </div>
  );
}
