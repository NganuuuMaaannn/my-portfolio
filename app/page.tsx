"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { IconType } from "react-icons";
import { motion } from "framer-motion";
import { FaFacebookF, FaGithub } from "react-icons/fa";
import {
  SiNextdotjs,
  SiReact,
  SiSupabase,
  SiTailwindcss,
} from "react-icons/si";

const techStack = [
  {
    name: "Next.js",
    icon: SiNextdotjs,
    description:
      "Handles the app routing, pages, and server-side rendering for the welcome page, admin, and public portfolio routes.",
    accent: "border-teal-300/20 bg-teal-400/10 text-teal-100",
  },
  {
    name: "React",
    icon: SiReact,
    description:
      "Powers the UI components and the admin editing experience for each student account.",
    accent: "border-orange-300/20 bg-orange-400/10 text-orange-100",
  },
  {
    name: "Supabase",
    icon: SiSupabase,
    description:
      "Stores portfolio data, manages authentication, and pushes realtime updates to live portfolio pages.",
    accent: "border-emerald-300/20 bg-emerald-400/10 text-emerald-100",
  },
  {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    description:
      "Builds the visual system quickly while keeping the interface responsive for desktop and mobile.",
    accent: "border-sky-300/20 bg-sky-400/10 text-sky-100",
  },
] satisfies Array<{
  name: string;
  icon: IconType;
  description: string;
  accent: string;
}>;

const developers = [
  {
    name: "Sean Michael T. Doinog",
    role: "Full-Stack Developer",
    summary: "In-charge of the Full-Stack development.",
    accent:
      "border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(15,23,42,0.72)_100%)]",
    socials: [
      {
        label: "GitHub",
        icon: FaGithub,
        href: "https://github.com/NganuuuMaaannn",
      },
      {
        label: "Facebook",
        icon: FaFacebookF,
        href: "https://www.facebook.com/seanthesheepzx",
      },
    ],
  },
  // {
  //   name: "Peejay Marco Apale",
  //   role: "Full-Stack Developer",
  //   summary: "In-charge of the Full-Stack development.",
  //   accent:
  //     "border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(15,23,42,0.72)_100%)]",
  //   socials: [
  //     {
  //       label: "GitHub",
  //       icon: FaGithub,
  //       href: "https://github.com/NganuuuMaaannn",
  //     },
  //     {
  //       label: "Facebook",
  //       icon: FaFacebookF,
  //       href: "https://www.facebook.com/seanthesheepzx",
  //     },
  //   ],
  // },
] satisfies Array<{
  name: string;
  role: string;
  summary: string;
  accent: string;
  socials: Array<{
    label: string;
    icon: IconType;
    href?: string;
  }>;
}>;

const revealEase = [0.22, 1, 0.36, 1] as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 56 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: revealEase,
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      ease: revealEase,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 34, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.78,
      ease: revealEase,
    },
  },
};

export default function Home() {
  const scrollAnimationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (scrollAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollAnimationFrameRef.current);
      }
    };
  }, []);

  const animateScrollTo = (
    targetY: number,
    duration = 1100,
    onComplete?: () => void,
  ) => {
    if (scrollAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(scrollAnimationFrameRef.current);
    }

    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime: number | null = null;

    const step = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startY + distance * easedProgress);

      if (progress < 1) {
        scrollAnimationFrameRef.current = window.requestAnimationFrame(step);
        return;
      }

      scrollAnimationFrameRef.current = null;
      onComplete?.();
    };

    scrollAnimationFrameRef.current = window.requestAnimationFrame(step);
  };

  const scrollToSection = (sectionId: string, offset = 88) => {
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const targetY = Math.max(sectionTop - offset, 0);

    animateScrollTo(targetY);
  };

  const handleScrollDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection("about-platform", 0);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden text-slate-100">
      <motion.div
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.22),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_24%),linear-gradient(180deg,#050816_0%,#081120_42%,#0d1a2b_100%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: revealEase }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30 bg-[linear-gradient(rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.1)_1px,transparent_1px)] bg-size-[88px_88px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.2, delay: 0.15, ease: revealEase }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-28 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-teal-400/10 blur-3xl"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.2, ease: revealEase }}
      />

      <section
        id="welcome-home"
        className="flex min-h-svh items-center overflow-hidden px-6 py-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-7xl">
          <section className="relative flex min-h-[calc(100svh-3rem)] flex-col items-center justify-center overflow-hidden sm:px-10">
            <motion.div
              className="relative flex max-w-4xl flex-col items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.45 }}
              variants={sectionVariants}
            >
              <motion.p
                className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-300"
                variants={itemVariants}
              >
                Student Portfolio Platform
              </motion.p>
              <motion.h1
                className="mt-8 text-5xl font-semibold leading-tight text-slate-50 sm:text-6xl xl:text-7xl"
                variants={itemVariants}
              >
                Welcome to Allena Hub
              </motion.h1>
              <motion.p
                className="mt-6 max-w-3xl text-lg leading-8 text-slate-300"
                variants={itemVariants}
              >
                Create an account, sign in to your dashboard, and build a portfolio you can publish and share on your own custom route.
                {" "}
                <Link
                  href="/student-portfolio"
                  className="font-semibold text-teal-300 decoration-teal-300/50 underline-offset-4 transition hover:text-teal-200"
                >
                  View sample page
                </Link>
                .
              </motion.p>

              <motion.div
                className="mt-10 flex flex-wrap items-center justify-center gap-4"
                variants={itemVariants}
              >
                <motion.div variants={cardVariants}>
                  <Link
                    href="/admin/login"
                    className="inline-flex min-w-40 items-center justify-center rounded-full border border-white/18 bg-white/6 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div variants={cardVariants}>
                  <Link
                    href="/admin/register"
                    className="inline-flex min-w-40 items-center justify-center rounded-full border border-teal-200/18 bg-slate-800/80 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:border-teal-300/40 hover:bg-slate-700/80"
                  >
                    Create Account
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.a
              href="#about-platform"
              onClick={handleScrollDown}
              className="absolute bottom-0 animate-bounce text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 transition hover:text-slate-200"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.7 }}
              variants={itemVariants}
            >
              Scroll Down
            </motion.a>
          </section>
        </div>
      </section>

      <section
        id="about-platform"
        className="flex min-h-svh items-center overflow-hidden px-6 py-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-7xl">
          <motion.div
            className="max-w-4xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={sectionVariants}
          >
            <motion.p
              className="text-sm font-semibold uppercase tracking-[0.26em] text-orange-200"
              variants={itemVariants}
            >
              What Is Allena Hub
            </motion.p>
            <motion.h2
              className="mt-4 text-4xl font-semibold text-slate-50 sm:text-5xl"
              variants={itemVariants}
            >
              A shared platform where every student can manage a personal portfolio without starting from zero.
            </motion.h2>
            <motion.p
              className="mt-6 text-lg leading-8 text-slate-300"
              variants={itemVariants}
            >
              Instead of building a separate website for every classmate, Allena Hub
              gives each student an account, an admin editor, and a dedicated public
              route. That means one system can support many students, while each
              portfolio still feels personal and easy to share.
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-10 grid gap-5 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <motion.article
              className="rounded-[28px] border border-white/10 bg-white/5 p-6"
              variants={cardVariants}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-200">
                Account Based
              </p>
              <p className="mt-4 text-base leading-8 text-slate-300">
                Every student signs in with a personal account and edits only their own portfolio data.
              </p>
            </motion.article>

            <motion.article
              className="rounded-[28px] border border-white/10 bg-white/5 p-6"
              variants={cardVariants}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">
                Admin Managed
              </p>
              <p className="mt-4 text-base leading-8 text-slate-300">
                Projects, certificates, hero text, and contact links are updated from one dashboard instead of editing code.
              </p>
            </motion.article>

            <motion.article
              className="rounded-[28px] border border-teal-300/12 bg-teal-400/10 p-6"
              variants={cardVariants}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-100">
                Public Route
              </p>
              <p className="mt-4 text-base leading-8 text-slate-100">
                Each student can publish to a custom slug such as <span className="font-semibold">/sean-portfolio</span>.
              </p>
            </motion.article>
          </motion.div>
        </div>
      </section>

      <section
        id="tech-stack"
        className="flex min-h-svh items-center overflow-hidden px-6 py-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-7xl">
          <motion.div
            className="max-w-4xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={sectionVariants}
          >
            <motion.p
              className="text-sm font-semibold uppercase tracking-[0.26em] text-teal-200"
              variants={itemVariants}
            >
              Tech Stack
            </motion.p>
            <motion.h2
              className="mt-4 text-4xl font-semibold text-slate-50 sm:text-5xl"
              variants={itemVariants}
            >
              Built with modern tools for authentication, content editing, public routing, and realtime updates.
            </motion.h2>
            <motion.p
              className="mt-6 text-lg leading-8 text-slate-300"
              variants={itemVariants}
            >
              The platform combines a modern frontend stack with a backend that can
              handle student accounts, portfolio storage, and live content updates.
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            {techStack.map((item) => (
              <motion.article
                key={item.name}
                className={`flex min-h-32 items-center justify-center rounded-[28px] border p-6 ${item.accent}`}
                variants={cardVariants}
              >
                <div className="flex items-center justify-center">
                  <item.icon className="h-12 w-12" aria-hidden="true" />
                  <span className="sr-only">{item.name}</span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        id="developers"
        className="flex min-h-svh items-center overflow-hidden px-6 py-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-7xl">
          <motion.div
            className="max-w-4xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={sectionVariants}
          >
            <motion.p
              className="text-sm font-semibold uppercase tracking-[0.26em] text-orange-200"
              variants={itemVariants}
            >
              Developers
            </motion.p>
            <motion.h2
              className="mt-4 text-4xl font-semibold text-slate-50 sm:text-5xl"
              variants={itemVariants}
            >
              Built by developers shaping the platform behind Allena Hub.
            </motion.h2>
            <motion.p
              className="mt-6 text-lg leading-8 text-slate-300"
              variants={itemVariants}
            >
              This section highlights the people working on the experience, interface,
              and implementation of the platform.
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-10 grid gap-6 lg:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            {developers.map((developer) => (
              <motion.article
                key={developer.name}
                className={`rounded-4xl border p-8 shadow-[0_20px_70px_rgba(2,6,23,0.28)] backdrop-blur ${developer.accent}`}
                variants={cardVariants}
              >
                <div className="flex min-h-64 flex-col">
                  <div>
                    <h3 className="text-3xl font-semibold tracking-tight text-slate-50">
                      {developer.name}
                    </h3>
                    <p className="mt-3 text-lg font-medium text-emerald-300">
                      {developer.role}
                    </p>
                  </div>

                  <p className="mt-12 max-w-xl text-lg leading-8 text-slate-400">
                    {developer.summary}
                  </p>

                  <div className="mt-auto flex items-center gap-4 pt-10">
                    {developer.socials.map((social) => {
                      const Icon = social.icon;

                      if (!social.href) {
                        return (
                          <div
                            key={social.label}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-slate-300"
                            aria-label={social.label}
                            title={social.label}
                          >
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </div>
                        );
                      }

                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-slate-300 transition hover:-translate-y-0.5 hover:border-emerald-300/30 hover:text-white"
                          aria-label={social.label}
                          title={social.label}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
