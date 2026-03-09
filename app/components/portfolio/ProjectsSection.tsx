import { FaExternalLinkAlt } from "react-icons/fa";

import { SectionReveal, TileReveal } from "./PortfolioMotion";
import type { Project } from "./types";

type ProjectsSectionProps = {
  projects: Project[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
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
        {projects.map((project, index) => (
          <TileReveal key={project.title} delay={0.06 + index * 0.06} className="h-full">
            <article className="flex h-full flex-col mt-auto rounded-4xl border border-white/10 bg-slate-900/66 p-5 shadow-[0_18px_60px_rgba(2,6,23,0.36)] backdrop-blur transition hover:-translate-y-1 hover:border-teal-300/30">
              <div className={`rounded-[28px] bg-linear-to-br ${project.accent} p-6 text-white auto flex h-full flex-col`}>
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
                  <span>{project.category}</span>
                  <span>{project.year}</span>
                </div>
                <div className="mt-12 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-5 text-2xl font-semibold leading-snug">{project.title}</h3>
              </div>

              <p className="mt-6 mb-10 text-sm leading-7 text-slate-300">{project.summary}</p>

              <div className="mt-auto mb-5 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-slate-100 transition hover:text-teal-300"
              >
                View Project
                <FaExternalLinkAlt className="text-xs" />
              </a>
            </article>
          </TileReveal>
        ))}
      </div>
    </SectionReveal>
  );
}
