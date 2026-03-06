import type { IconType } from "react-icons";

export type NavItem = {
  label: string;
  id: string;
};

export type HeroStat = {
  value: string;
  label: string;
};

export type Capability = {
  title: string;
  description: string;
};

export type Project = {
  title: string;
  category: string;
  year: string;
  summary: string;
  stack: string[];
  href: string;
  accent: string;
};

export type Certificate = {
  title: string;
  website: string;
  href: string;
  image: string;
  issued: string;
};

export type ContactMethod = {
  label: string;
  value: string;
  href: string;
  icon: IconType;
};
