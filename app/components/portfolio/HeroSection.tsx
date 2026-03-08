"use client";

import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

import {
  revealEase,
  TileReveal,
} from "./PortfolioMotion";
import type { HeroStat } from "./types";

type HeroSectionProps = {
  heroStats: HeroStat[];
  onNavigate: (sectionId: string) => void;
};

export function HeroSection({ heroStats, onNavigate }: HeroSectionProps) {
  return (
    <motion.section
      id="home"
      className="mx-auto grid max-w-6xl scroll-mt-28 gap-12 px-6 pb-20 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-24 lg:pt-24"
    >
      <div className="flex flex-col justify-center">
        <motion.span
          className="inline-flex w-fit rounded-full border border-teal-300/20 bg-teal-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-teal-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.78, delay: 0.24, ease: revealEase }}
        >
          Dummy portfolio landing page
        </motion.span>
        <motion.h1
          className="mt-8 max-w-3xl text-5xl font-semibold leading-tight text-slate-50 sm:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.02, delay: 0.36, ease: revealEase }}
        >
          Building clean digital experiences with story, structure, and strong UI rhythm.
        </motion.h1>
        <motion.p
          className="mt-6 max-w-2xl text-lg leading-8 text-slate-300"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.96, delay: 0.5, ease: revealEase }}
        >
          This homepage uses placeholder content for an about section, project gallery,
          certificates, and contact details. It is designed to feel more like a
          complete personal portfolio instead of the default starter page.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.86, delay: 0.64, ease: revealEase }}
        >
          <a
            href="#projects"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("projects");
            }}
            className="inline-flex items-center gap-2 rounded-full bg-teal-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-300"
          >
            View projects
            <FaArrowRight className="text-xs" />
          </a>
          <a
            href="#certificates"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("certificates");
            }}
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-teal-300/35 hover:bg-white/10"
          >
            Explore certificates
          </a>
        </motion.div>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {heroStats.map((stat, index) => (
            <TileReveal key={stat.label} delay={0.78 + index * 0.1}>
              <div className="rounded-[28px] border border-white/10 bg-white/6 px-5 py-6 shadow-[0_18px_50px_rgba(2,6,23,0.28)] backdrop-blur">
                <p className="text-3xl font-semibold text-slate-50">{stat.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{stat.label}</p>
              </div>
            </TileReveal>
          ))}
        </div>
      </div>

      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.46, ease: revealEase }}
      >
        <div className="absolute -inset-6 rounded-[42px] bg-teal-500/15 blur-3xl" />
        <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-slate-900/70 p-7 shadow-[0_24px_80px_rgba(2,6,23,0.4)] backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
                Snapshot
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-50">
                Sample creative profile
              </h2>
            </div>
            <span className="rounded-full bg-emerald-400/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Available
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <TileReveal delay={0.88}>
              <div className="rounded-[28px] bg-slate-950 p-5 text-white">
                <p className="text-xs uppercase tracking-[0.24em] text-white/60">Focus</p>
                <p className="mt-4 text-xl font-semibold">
                  Portfolio, dashboard, and landing page work.
                </p>
              </div>
            </TileReveal>
            <TileReveal delay={0.98}>
              <div className="rounded-[28px] border border-orange-300/10 bg-orange-400/10 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-orange-200">
                  Process
                </p>
                <p className="mt-4 text-xl font-semibold text-slate-50">
                  Research, wireframe, build, polish, and handoff.
                </p>
              </div>
            </TileReveal>
            <TileReveal delay={1.08}>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Strength
                </p>
                <p className="mt-4 text-xl font-semibold text-slate-50">
                  Interfaces that stay clear even as features scale.
                </p>
              </div>
            </TileReveal>
            <TileReveal delay={1.18}>
              <div className="rounded-[28px] border border-teal-300/10 bg-teal-400/10 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-teal-200">Goal</p>
                <p className="mt-4 text-xl font-semibold text-slate-50">
                  Turn rough ideas into something people can trust and use fast.
                </p>
              </div>
            </TileReveal>
          </div>

          <div className="mt-7 rounded-[30px] border border-dashed border-white/14 bg-slate-950/45 px-5 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Dummy content note
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Swap the copy, links, and images here with your own profile details once
              you are ready to turn this into a real portfolio.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
