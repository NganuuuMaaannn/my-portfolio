"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

export const revealEase = [0.22, 1, 0.36, 1] as const;

type SectionRevealProps = HTMLMotionProps<"section"> & {
  delay?: number;
};

type TileRevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

type HeaderProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

export function PageIntroOverlay() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-60 bg-[linear-gradient(80deg,rgba(8,15,35,0.98)_0%,rgba(6,10,26,0.94)_58%,rgba(6,10,26,0.72)_100%)]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0.12 }}
      transition={{ duration: 3.45, ease: revealEase }}
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-teal-300/80 to-transparent"
        initial={{ opacity: 0, scaleX: 0.2 }}
        animate={{ opacity: [0, 1, 0], scaleX: 1 }}
        transition={{ delay: 0.18, duration: 1.18, ease: revealEase }}
      />
    </motion.div>
  );
}

export function SectionReveal({
  children,
  className,
  delay = 0,
  ...props
}: SectionRevealProps) {
  return (
    <motion.section
      {...props}
      className={["will-change-transform", className].filter(Boolean).join(" ")}
      initial={{ opacity: 0, y: 56, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 1.05, delay, ease: revealEase }}
    >
      {children}
    </motion.section>
  );
}

export function TileReveal({
  children,
  className,
  delay = 0,
  ...props
}: TileRevealProps) {
  return (
    <motion.div
      {...props}
      className={["will-change-transform", className].filter(Boolean).join(" ")}
      initial={{ opacity: 0, y: 30, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: 0.92, delay, ease: revealEase }}
    >
      {children}
    </motion.div>
  );
}

export function HeaderReveal({
  children,
  className,
  delay = 0,
  ...props
}: HeaderProps) {
  return (
    <motion.div
      {...props}
      className={["will-change-transform", className].filter(Boolean).join(" ")}
      initial={{ opacity: 0, y: -30 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: 0.92, delay, ease: revealEase }}
    >
      {children}
    </motion.div>
  );
}
