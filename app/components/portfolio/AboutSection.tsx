"use client";

import Image from "next/image";
import type { Capability } from "./types";
import { motion } from "framer-motion";
import { revealEase } from "./PortfolioMotion";

type AboutSectionProps = {
  ownerName: string;
  aboutBio: string;
  roleTitle: string;
  specialty: string;
  capabilities: Capability[];
};


function getAboutCopy(ownerName: string, aboutBio: string) {
  const trimmedBio = aboutBio.trim();

  if (trimmedBio) {
    return trimmedBio;
  }

  const resolvedName = ownerName.trim();

  return `Hi! I'm ${resolvedName}, a front-end developer passionate about modern design, smooth interactions, and responsive user interfaces. I focus mainly on front-end development while also understanding basic back-end concepts. I've worked with React Native, React JS, Next.js, TypeScript, and JavaScript, and I enjoy adding a creative touch through design, photo editing, and video work. I'm adaptable, detail-oriented, and always eager to learn new frameworks and programming languages to keep growing in tech.`;
}

export function AboutSection({ ownerName, aboutBio }: AboutSectionProps) {
  const resolvedOwnerName = ownerName.trim() || "Sean";
  const resolvedAboutCopy = getAboutCopy(ownerName, aboutBio);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-slate-100">
      <section
        id="about"
        className="relative mx-auto max-w-6xl scroll-mt-28 px-6 py-20 lg:px-8 lg:py-24"
      >
        <div className="pointer-events-none absolute -left-24 top-6 h-48 w-48 rounded-full bg-pink-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 right-0 h-56 w-56 rounded-full bg-teal-400/10 blur-3xl" />

        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-20">
          <div className="max-w-3xl">
            <motion.h2
              className="text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl"
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: revealEase }}
            >
              About Me
            </motion.h2>

            <motion.p
              className="mt-10 max-w-2xl text-[15px] leading-[2.1] text-slate-200/90 sm:text-[18px]"
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.2, ease: revealEase }}
            >
              {resolvedAboutCopy}
            </motion.p>
          </div>

          <div className="absolute inset-8 -z-10 rounded-[34px]" />
          <motion.div
            className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[26px] shadow-[0_24px_80px_rgba(2,6,23,0.42)]"
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1, delay: 0.4, ease: revealEase }}
          >
            <Image
              src="/Sample.png"
              alt={`${resolvedOwnerName} portrait`}
              width={840}
              height={1040}
              className="aspect-4/5 h-full w-full object-cover transition duration-1000 hover:scale-105"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
