import Image from "next/image";
import { FaExternalLinkAlt } from "react-icons/fa";

import type { Certificate } from "./types";

type CertificatesSectionProps = {
  certificates: Certificate[];
};

export function CertificatesSection({
  certificates,
}: CertificatesSectionProps) {
  return (
    <section
      id="certificates"
      className="mx-auto max-w-6xl scroll-mt-28 px-6 py-16 lg:px-8 lg:py-20"
    >
      <div className="rounded-[36px] border border-white/10 bg-slate-900/68 p-8 shadow-[0_24px_80px_rgba(2,6,23,0.34)] backdrop-blur sm:p-10">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-teal-200">
              Certificates
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-50 sm:text-4xl">
              Four certificate cards with image, website, and link details.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-slate-300">
            These credentials are dummy examples. Replace the preview images and links
            with your real certificate assets later.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {certificates.map((certificate) => (
            <article
              key={certificate.title}
              className="rounded-[30px] border border-white/10 bg-white/5 p-5"
            >
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70">
                <Image
                  src={certificate.image}
                  alt={certificate.title}
                  width={640}
                  height={420}
                  className="h-56 w-full object-cover"
                />
              </div>

              <div className="mt-5">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <span>{certificate.website}</span>
                  <span>{certificate.issued}</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-slate-50">
                  {certificate.title}
                </h3>

                <div className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
                  <p>
                    <span className="font-semibold text-slate-50">Website:</span>{" "}
                    {certificate.website}
                  </p>
                  <p className="break-all">
                    <span className="font-semibold text-slate-50">Link:</span>{" "}
                    {certificate.href}
                  </p>
                </div>

                <a
                  href={certificate.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-100 transition hover:text-teal-300"
                >
                  Open certificate
                  <FaExternalLinkAlt className="text-xs" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
