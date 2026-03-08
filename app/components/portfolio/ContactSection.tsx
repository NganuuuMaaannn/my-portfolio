import { FaArrowRight } from "react-icons/fa";

import { SectionReveal, TileReveal } from "./PortfolioMotion";
import type { ContactMethod } from "./types";

type ContactSectionProps = {
  contactMethods: ContactMethod[];
  onNavigate: (sectionId: string) => void;
};

export function ContactSection({
  contactMethods,
  onNavigate,
}: ContactSectionProps) {
  return (
    <SectionReveal
      id="contact"
      className="mx-auto max-w-6xl scroll-mt-28 px-6 py-16 lg:px-8 lg:py-20"
      delay={0.05}
    >
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[36px] bg-slate-950 p-8 text-white shadow-[0_28px_90px_rgba(2,6,23,0.44)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-teal-200">
            Contact
          </p>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Ready for the final section: a clean contact area that invites action.
          </h2>
          <p className="mt-6 text-base leading-8 text-slate-300">
            Use this area for your real email, phone number, social links, or booking
            page. For now, it contains placeholder contact details to complete the
            portfolio.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="mailto:hello@seanmichael.dev"
              className="inline-flex items-center gap-2 rounded-full bg-teal-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-300"
            >
              Send an email
              <FaArrowRight className="text-xs" />
            </a>
            <button
              type="button"
              onClick={() => onNavigate("projects")}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
            >
              Back to projects
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {contactMethods.map((item, index) => {
            const Icon = item.icon;

            return (
              <TileReveal key={item.label} delay={0.06 + index * 0.05}>
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="block rounded-[30px] border border-white/10 bg-slate-900/66 p-6 shadow-[0_18px_60px_rgba(2,6,23,0.36)] transition hover:-translate-y-1 hover:border-teal-300/30"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-300/12 text-teal-200">
                    <Icon />
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-50">{item.value}</p>
                </a>
              </TileReveal>
            );
          })}

          <TileReveal delay={0.26} className="sm:col-span-2">
            <div className="rounded-[30px] border border-dashed border-orange-300/15 bg-orange-400/10 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">
                Placeholder reminder
              </p>
              <p className="mt-3 text-base leading-8 text-slate-300">
                The email, phone, portfolio links, and certificate URLs above are dummy
                values. Replace them with your actual contact information before
                publishing.
              </p>
            </div>
          </TileReveal>
        </div>
      </div>
    </SectionReveal>
  );
}
