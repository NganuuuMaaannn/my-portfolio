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
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-teal-200">
            Projects
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-50 sm:text-4xl">
            Six portfolio-ready project tiles with placeholder descriptions.
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-8 text-slate-300">
          Each card can hold a project summary, timeline, tech stack, and external
          link. Right now it is populated with dummy case studies so the layout feels
          complete.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <TileReveal key={project.title} delay={0.06 + index * 0.06} className="h-full">
            <article className="flex h-full flex-col rounded-4xl border border-white/10 bg-slate-900/66 p-5 shadow-[0_18px_60px_rgba(2,6,23,0.36)] backdrop-blur">
              <div className={`rounded-[28px] bg-linear-to-br ${project.accent} p-6 text-white`}>
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
                  <span>{project.category}</span>
                  <span>{project.year}</span>
                </div>
                <div className="mt-12 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-5 text-2xl font-semibold leading-snug">{project.title}</h3>
              </div>

              <p className="mt-6 text-sm leading-7 text-slate-300">{project.summary}</p>

              <div className="mt-6 flex flex-wrap gap-2">
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
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-100 transition hover:text-teal-300"
              >
                View project
                <FaExternalLinkAlt className="text-xs" />
              </a>
            </article>
          </TileReveal>
        ))}
      </div>
    </SectionReveal>
  );
}
