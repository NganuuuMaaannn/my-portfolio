import Image from "next/image";
import { FaExternalLinkAlt } from "react-icons/fa";

import { getProjectLinkPresentation } from "./data";
import { SectionReveal, TileReveal } from "./PortfolioMotion";
import type { Project } from "./types";

type ProjectsSectionProps = {
  projects: Project[];
};

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

            return (
              <TileReveal key={project.title} delay={0.06 + index * 0.06} className="h-full">
                <article className="mt-auto flex h-full flex-col rounded-4xl border border-white/10 bg-slate-900/66 p-5 shadow-[0_18px_60px_rgba(2,6,23,0.36)] backdrop-blur transition hover:-translate-y-1 hover:border-teal-300/30">
                  <div className="group relative overflow-hidden rounded-[28px]">
                    <Image
                      src={project.image || "/project-cover-placeholder.svg"}
                      alt={`${project.title} preview`}
                      width={960}
                      height={720}
                      className="aspect-4/3 w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div
                      className={`pointer-events-none absolute inset-0 bg-linear-to-br ${project.accent} opacity-45 mix-blend-screen`}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/35 to-slate-950/10" />

                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <h3 className="mt-5 text-2xl font-semibold leading-snug">{project.title}</h3>
                    </div>
                  </div>

                  <p className="mt-6 text-sm leading-7 text-slate-300">{project.summary}</p>

                  <div className="mb-5 mt-5 flex flex-wrap gap-2">
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
                      className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-slate-100 transition hover:text-teal-300"
                    >
                      {projectLink.label}
                      <FaExternalLinkAlt className="text-xs" />
                    </a>
                  ) : (
                    <p className="mt-auto text-sm font-semibold text-red-300">{projectLink.label}</p>
                  )}
                </article>
              </TileReveal>
            );
          })}
        </div>
      </SectionReveal>
    </div>
  );
}
