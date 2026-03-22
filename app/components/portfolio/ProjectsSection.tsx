import Image from "next/image";
import { FaExternalLinkAlt } from "react-icons/fa";

import { getProjectLinkPresentation } from "./data";
import { SectionReveal, TileReveal } from "./PortfolioMotion";
import type { Project } from "./types";

type ProjectsSectionProps = {
  projects: Project[];
};

const projectCardGradientClasses = [
  "from-teal-400/5 via-slate-900/10 to-cyan-400/10",
  "from-sky-400/5 via-slate-900/10 to-indigo-400/10",
  "from-emerald-400/5 via-slate-900/10 to-teal-300/10",
  "from-amber-300/5 via-slate-900/10 to-orange-400/10",
  "from-rose-300/5 via-slate-900/10 to-fuchsia-400/10",
] as const;

const projectCardGlowClasses = [
  "from-teal-300/5 via-cyan-300/10 to-transparent",
  "from-sky-300/5 via-indigo-300/10 to-transparent",
  "from-emerald-300/5 via-teal-300/10 to-transparent",
  "from-amber-200/5 via-orange-300/10 to-transparent",
  "from-rose-200/5 via-fuchsia-300/10 to-transparent",
] as const;

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SectionReveal
        id="projects"
        className="mx-auto max-w-6xl scroll-mt-28 px-6 py-16 lg:px-8 lg:py-20"
        delay={0.06}
      >
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-2xl font-semibold uppercase tracking-[0.26em] text-teal-200">
              Projects
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => {
            const projectLink = getProjectLinkPresentation(project);
            const cardGradientClass =
              projectCardGradientClasses[index % projectCardGradientClasses.length];
            const cardGlowClass =
              projectCardGlowClasses[index % projectCardGlowClasses.length];

            return (
              <TileReveal key={project.title} delay={0.06 + index * 0.06} className="h-full">
                <article
                  className={`relative mt-auto flex h-full flex-col overflow-hidden rounded-4xl border border-white/10 bg-linear-to-br ${cardGradientClass} p-5 shadow-[0_18px_60px_rgba(2,6,23,0.36)] backdrop-blur transition hover:-translate-y-1 hover:border-teal-300/30`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-linear-to-br ${cardGlowClass} opacity-30`}
                  />
                  <div className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

                  <div className="group relative z-10 overflow-hidden rounded-[28px]">
                    <Image
                      src={project.image || "/project-cover-placeholder.svg"}
                      alt={`${project.title} preview`}
                      width={960}
                      height={720}
                      className="aspect-4/3 w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="relative z-10 mt-0 text-sm leading-7 text-slate-300">
                    <h3 className="mt-5 text-2xl font-semibold leading-snug">{project.title}</h3>
                  </div>
                  <p className="relative z-10 mt-2 text-sm leading-7 text-slate-300">
                    {project.summary}
                  </p>
                  <div className="relative z-10 mt-auto flex flex-col gap-2 pt-10">
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    {projectLink.href ? (
                      <a
                        href={projectLink.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 mt-2 text-sm font-semibold text-slate-100 transition hover:text-teal-300"
                      >
                        {projectLink.label}
                        <FaExternalLinkAlt className="text-xs" />
                      </a>
                    ) : (
                      <p className="text-sm mt-2 font-semibold text-red-300">{projectLink.label}</p>
                    )}
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
