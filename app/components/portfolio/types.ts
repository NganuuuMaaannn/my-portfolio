export const contactIconNames = [
  "email",
  "phone",
  "location",
  "linkedin",
  "github",
  "website",
] as const;

export type ContactIconName = (typeof contactIconNames)[number];

export const projectLinkTypes = [
  "live",
  "repository",
  "private",
] as const;

export type ProjectLinkType = (typeof projectLinkTypes)[number];

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
  linkType: ProjectLinkType;
  accent: string;
  image: string;
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
  icon: ContactIconName;
};

export type HeroContact = {
  label: string;
  href: string;
  icon: ContactIconName;
};

export type PortfolioContent = {
  portfolioSlug: string;
  ownerName: string;
  headline: string;
  intro: string;
  aboutBio: string;
  aboutImage: string;
  roleTitle: string;
  specialty: string;
  contactMessage: string;
  isPublished: boolean;
  navItems: NavItem[];
  heroStats: HeroStat[];
  capabilities: Capability[];
  projects: Project[];
  certificates: Certificate[];
  heroContacts: HeroContact[];
  contactMethods: ContactMethod[];
};

export type PortfolioRow = {
  id: string;
  owner_id: string;
  portfolio_slug: string;
  owner_name: string;
  headline: string;
  intro: string;
  about_bio: string;
  about_image: string;
  role_title: string;
  specialty: string;
  contact_message: string;
  is_published: boolean;
  hero_stats: unknown;
  capabilities: unknown;
  projects: unknown;
  certificates: unknown;
  hero_contacts: unknown;
  contact_methods: unknown;
  created_at: string;
  updated_at: string;
};

export type PortfolioUpsertPayload = {
  owner_id: string;
  portfolio_slug: string;
  owner_name: string;
  headline: string;
  intro: string;
  about_bio: string;
  about_image: string;
  role_title: string;
  specialty: string;
  contact_message: string;
  is_published: boolean;
  hero_stats: HeroStat[];
  capabilities: Capability[];
  projects: Project[];
  certificates: Certificate[];
  hero_contacts: HeroContact[];
  contact_methods: ContactMethod[];
};
