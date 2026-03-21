import type {
  Capability,
  Certificate,
  ContactIconName,
  ContactMethodKind,
  ContactMethod,
  HeroContact,
  HeroStat,
  NavItem,
  PortfolioContent,
  PortfolioRow,
  PortfolioUpsertPayload,
  Project,
  ProjectLinkType,
} from "./types";
import { projectLinkTypes } from "./types";

const projectAccents = [
  "from-[#0f766e] via-[#14b8a6] to-[#99f6e4]",
  "from-[#0f172a] via-[#334155] to-[#cbd5e1]",
  "from-[#9a3412] via-[#f97316] to-[#fdba74]",
  "from-[#365314] via-[#65a30d] to-[#d9f99d]",
  "from-[#7c2d12] via-[#ea580c] to-[#fed7aa]",
  "from-[#1d4ed8] via-[#60a5fa] to-[#dbeafe]",
] as const;

const defaultAboutImage = "/profile-portrait.svg";
const defaultProjectImage = "/project-cover-placeholder.svg";
const repositoryHosts = ["github.com", "gitlab.com", "bitbucket.org"];
const resumePattern = /(?:^|\b)(resume|cv|curriculum vitae)(?:\b|$)|\.pdf(?:$|[?#])/i;

export const navItems: NavItem[] = [
  { label: "About", id: "about" },
  { label: "Projects", id: "projects" },
  { label: "Certificates", id: "certificates" },
  { label: "Contact", id: "contact" },
];

export const reservedPortfolioSlugs = new Set([
  "admin",
  "api",
  "auth",
  "login",
  "register",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

const defaultHeroStats: HeroStat[] = [
  { value: "06", label: "Projects shipped" },
  { value: "04", label: "Certificates earned" },
  { value: "24h", label: "Reply time target" },
];

const defaultCapabilities: Capability[] = [
  {
    title: "Product Thinking",
    description:
      "I like mapping user problems before touching the interface so every screen solves a clear job.",
  },
  {
    title: "UI Systems",
    description:
      "My design process balances layout, typography, and reusable components that stay coherent as features grow.",
  },
  {
    title: "Frontend Craft",
    description:
      "I build polished interfaces with strong attention to responsive behavior, motion, and readable code structure.",
  },
  {
    title: "Team Workflow",
    description:
      "I work closely with founders, designers, and developers to ship clear iterations instead of vague big-bang releases.",
  },
];

const defaultProjects: Project[] = [
  {
    title: "Northstar Commerce Dashboard",
    category: "Web App",
    year: "2026",
    summary:
      "A sales intelligence dashboard for a growing retail team, built to monitor revenue, orders, and campaign performance in one place.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Chart UI"],
    href: "https://example.com/projects/northstar-commerce-dashboard",
    linkType: "live",
    accent: projectAccents[0],
    image: defaultProjectImage,
  },
  {
    title: "PulseFit Mobile Coach",
    category: "Mobile UX",
    year: "2026",
    summary:
      "A habit-driven fitness app concept with onboarding, personalized routines, and friendly progress feedback for daily motivation.",
    stack: ["React Native", "Figma", "Health Data", "Notifications"],
    href: "https://example.com/projects/pulsefit-mobile-coach",
    linkType: "live",
    accent: projectAccents[1],
    image: defaultProjectImage,
  },
  {
    title: "Classroom Connect Portal",
    category: "Education",
    year: "2025",
    summary:
      "A portal for students and teachers to manage assignments, attendance, and announcements with a calm and approachable interface.",
    stack: ["Next.js", "Supabase", "Role Access", "Messaging"],
    href: "https://example.com/projects/classroom-connect-portal",
    linkType: "live",
    accent: projectAccents[2],
    image: defaultProjectImage,
  },
  {
    title: "Harvest Supply Tracker",
    category: "Operations",
    year: "2025",
    summary:
      "A lightweight inventory tracker for a distribution team with stock alerts, warehouse summaries, and delivery preparation tools.",
    stack: ["Dashboard", "Inventory", "Analytics", "Reports"],
    href: "https://example.com/projects/harvest-supply-tracker",
    linkType: "live",
    accent: projectAccents[3],
    image: defaultProjectImage,
  },
  {
    title: "Nomad Studio Portfolio Builder",
    category: "Creator Tools",
    year: "2025",
    summary:
      "A drag-and-drop concept for freelancers who want to assemble case studies, testimonials, and contact pages without code.",
    stack: ["CMS", "Blocks", "Branding", "Animations"],
    href: "https://example.com/projects/nomad-studio-portfolio-builder",
    linkType: "live",
    accent: projectAccents[4],
    image: defaultProjectImage,
  },
  {
    title: "Beacon Support Hub",
    category: "Customer Success",
    year: "2024",
    summary:
      "A support workspace that combines ticket triage, knowledge base content, and SLA tracking for fast internal collaboration.",
    stack: ["Knowledge Base", "Support Ops", "Search", "Workflows"],
    href: "https://example.com/projects/beacon-support-hub",
    linkType: "live",
    accent: projectAccents[5],
    image: defaultProjectImage,
  },
];

const defaultCertificates: Certificate[] = [
  {
    title: "UX Strategy Foundations",
    website: "DesignLab Academy",
    href: "https://example.com/certificates/ux-strategy-foundations",
    image: "/certificate-ux-strategy.svg",
    issued: "Issued Jan 2026",
  },
  {
    title: "Frontend Performance Specialist",
    website: "DevSprint Institute",
    href: "https://example.com/certificates/frontend-performance-specialist",
    image: "/certificate-frontend-performance.svg",
    issued: "Issued Nov 2025",
  },
  {
    title: "Cloud Product Delivery",
    website: "Nimbus Learning",
    href: "https://example.com/certificates/cloud-product-delivery",
    image: "/certificate-cloud-delivery.svg",
    issued: "Issued Aug 2025",
  },
  {
    title: "Agile Team Facilitation",
    website: "SprintWorks",
    href: "https://example.com/certificates/agile-team-facilitation",
    image: "/certificate-agile-team.svg",
    issued: "Issued Apr 2025",
  },
];

const createDefaultContactMethods = (ownerName: string, email?: string): ContactMethod[] => {
  const normalizedName = sanitizePortfolioSlug(ownerName || "student");

  return [
    {
      label: "Email",
      value: email || `hello@${normalizedName}.dev`,
      href: `mailto:${email || `hello@${normalizedName}.dev`}`,
      icon: "email",
      kind: "contact",
    },
    {
      label: "Phone",
      value: "+63 912 345 6789",
      href: "tel:+639123456789",
      icon: "phone",
      kind: "contact",
    },
    {
      label: "Location",
      value: "Quezon City, Philippines",
      href: "https://maps.google.com/?q=Quezon+City+Philippines",
      icon: "location",
      kind: "contact",
    },
    {
      label: "LinkedIn",
      value: `linkedin.com/in/${normalizedName}`,
      href: `https://linkedin.com/in/${normalizedName}`,
      icon: "linkedin",
      kind: "contact",
    },
    {
      label: "GitHub",
      value: `github.com/${normalizedName}`,
      href: `https://github.com/${normalizedName}`,
      icon: "github",
      kind: "contact",
    },
    {
      label: "Website",
      value: `${normalizedName}.allenahub.app`,
      href: `/${normalizedName}-portfolio`,
      icon: "website",
      kind: "contact",
    },
  ];
};

export function sanitizePortfolioSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 60);
}

export function validatePortfolioSlug(value: string) {
  if (!value) {
    return "Portfolio slug is required.";
  }

  if (value.length < 3 || value.length > 60) {
    return "Portfolio slug must be between 3 and 60 characters.";
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    return "Use lowercase letters, numbers, and hyphens only.";
  }

  if (reservedPortfolioSlugs.has(value)) {
    return "That slug is reserved. Choose a different one.";
  }

  return null;
}

export function getPortfolioPath(portfolioSlug: string) {
  return `/${portfolioSlug}`;
}

type PortfolioSeed = {
  ownerName?: string | null;
  email?: string | null;
  username?: string | null;
};

function cloneHeroStats(heroStats: HeroStat[]) {
  return heroStats.map((item) => ({ ...item }));
}

function cloneCapabilities(capabilities: Capability[]) {
  return capabilities.map((item) => ({ ...item }));
}

function cloneProjects(projects: Project[]) {
  return projects.map((item) => ({
    ...item,
    stack: [...item.stack],
  }));
}

function cloneCertificates(certificates: Certificate[]) {
  return certificates.map((item) => ({ ...item }));
}

function cloneContactMethods(contactMethods: ContactMethod[]) {
  return contactMethods.map((item) => ({ ...item }));
}

function cloneHeroContacts(heroContacts: HeroContact[]) {
  return heroContacts.map((item) => ({ ...item }));
}

const heroContactOrder: ContactIconName[] = [
  "github",
  "email",
  "linkedin",
  "website",
];

export function isResumeContactMethod(
  item: Pick<ContactMethod, "kind" | "label" | "value" | "href">,
) {
  if (item.kind === "resume") {
    return true;
  }

  return resumePattern.test(`${item.label} ${item.value} ${item.href}`);
}

export function getVisibleContactMethods(contactMethods: ContactMethod[]) {
  return contactMethods.filter((item) => !isResumeContactMethod(item));
}

function buildHeroContactsFromContactMethods(contactMethods: ContactMethod[]): HeroContact[] {
  return heroContactOrder
    .map((icon) =>
      contactMethods.find(
        (item) => item.icon === icon && !isResumeContactMethod(item),
      ),
    )
    .filter((item): item is ContactMethod => Boolean(item && item.href && item.href !== "#"))
    .map((item) => ({
      label: item.label,
      href: item.href,
      icon: item.icon,
    }));
}

export function buildDefaultPortfolioContent(seed: PortfolioSeed = {}): PortfolioContent {
  const ownerName = seed.ownerName?.trim() || "Student Name";
  const usernameSeed = seed.username?.trim() || ownerName;
  const baseSlug = sanitizePortfolioSlug(usernameSeed) || "student";
  const portfolioSlug =
    sanitizePortfolioSlug(`${baseSlug}-portfolio`) || "student-portfolio";
  const defaultContactMethods = createDefaultContactMethods(ownerName, seed.email || undefined);

  return {
    portfolioSlug,
    ownerName,
    headline: `Building clean digital experiences with story, structure, and strong UI rhythm.`,
    intro:
      "This portfolio is ready for real student content. Replace the sample copy, projects, and contact details with your own work from the admin dashboard.",
    aboutBio: `I am ${ownerName}, a frontend-focused student builder who enjoys turning rough concepts into polished websites and app experiences. My work usually starts with understanding the audience, organizing the content, and then building a visual system that feels calm and memorable.`,
    aboutImage: defaultAboutImage,
    roleTitle: "UI Designer and Frontend Developer",
    specialty: "Portfolio sites, admin tools, and modern landing pages.",
    contactMessage:
      "Use this space to share your real email, phone number, social links, or booking page so classmates, recruiters, and collaborators can reach you.",
    isPublished: true,
    navItems: navItems.map((item) => ({ ...item })),
    heroStats: cloneHeroStats(defaultHeroStats),
    capabilities: cloneCapabilities(defaultCapabilities),
    projects: cloneProjects(defaultProjects),
    certificates: cloneCertificates(defaultCertificates),
    heroContacts: cloneHeroContacts(
      buildHeroContactsFromContactMethods(defaultContactMethods),
    ),
    contactMethods: cloneContactMethods(defaultContactMethods),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeString(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed || fallback;
}

function isProjectLinkType(value: unknown): value is ProjectLinkType {
  return typeof value === "string" && projectLinkTypes.includes(value as ProjectLinkType);
}

export function inferProjectLinkTypeFromHref(href: string): ProjectLinkType {
  const trimmedHref = href.trim();
  if (!trimmedHref || trimmedHref === "#") {
    return "private";
  }

  try {
    const parsedHref = new URL(
      trimmedHref.startsWith("http://") || trimmedHref.startsWith("https://")
        ? trimmedHref
        : `https://${trimmedHref}`,
    );
    const normalizedHost = parsedHref.hostname.toLowerCase();

    if (
      repositoryHosts.some(
        (host) => normalizedHost === host || normalizedHost.endsWith(`.${host}`),
      )
    ) {
      return "repository";
    }
  } catch {
    const loweredHref = trimmedHref.toLowerCase();
    if (repositoryHosts.some((host) => loweredHref.includes(host))) {
      return "repository";
    }
  }

  return "live";
}

export function resolveProjectLinkType(
  value: unknown,
  href: string,
): ProjectLinkType {
  if (!href.trim() || href.trim() === "#") {
    return "private";
  }

  return isProjectLinkType(value) ? value : inferProjectLinkTypeFromHref(href);
}

export function getProjectLinkPresentation(
  project: Pick<Project, "href" | "linkType">,
) {
  const normalizedHref = project.href.trim();
  const linkType = resolveProjectLinkType(project.linkType, normalizedHref);

  if (linkType === "private") {
    return {
      kind: "private" as const,
      href: null,
      label: "Private Repository",
    };
  }

  if (linkType === "repository") {
    return {
      kind: "repository" as const,
      href: normalizedHref,
      label: "Open Repository",
    };
  }

  return {
    kind: "live" as const,
    href: normalizedHref,
    label: "Open Live Preview",
  };
}

function normalizeHeroStats(value: unknown, fallback: HeroStat[]) {
  if (!Array.isArray(value)) {
    return cloneHeroStats(fallback);
  }

  const normalized = value
    .filter(isRecord)
    .map((item) => ({
      value: normalizeString(item.value, ""),
      label: normalizeString(item.label, ""),
    }))
    .filter((item) => item.value && item.label);

  return normalized.length > 0 ? normalized : cloneHeroStats(fallback);
}

function normalizeCapabilities(value: unknown, fallback: Capability[]) {
  if (!Array.isArray(value)) {
    return cloneCapabilities(fallback);
  }

  const normalized = value
    .filter(isRecord)
    .map((item) => ({
      title: normalizeString(item.title, ""),
      description: normalizeString(item.description, ""),
    }))
    .filter((item) => item.title && item.description);

  return normalized.length > 0 ? normalized : cloneCapabilities(fallback);
}

function normalizeProjects(value: unknown, fallback: Project[]) {
  if (!Array.isArray(value)) {
    return cloneProjects(fallback);
  }

  const normalized = value
    .filter(isRecord)
    .map((item, index) => {
      const stack = Array.isArray(item.stack)
        ? item.stack
            .filter((stackItem): stackItem is string => typeof stackItem === "string")
            .map((stackItem) => stackItem.trim())
            .filter(Boolean)
        : [];

      return {
        title: normalizeString(item.title, ""),
        category: normalizeString(item.category, "Project"),
        year: normalizeString(item.year, "2026"),
        summary: normalizeString(item.summary, ""),
        stack: stack.length > 0 ? stack : ["Next.js", "TypeScript"],
        href: normalizeString(item.href, "#"),
        linkType: resolveProjectLinkType(item.linkType, normalizeString(item.href, "#")),
        accent: normalizeString(
          item.accent,
          projectAccents[index % projectAccents.length],
        ),
        image: normalizeString(
          item.image,
          fallback[index]?.image || defaultProjectImage,
        ),
      };
    })
    .filter((item) => item.title && item.summary);

  return normalized.length > 0 ? normalized : cloneProjects(fallback);
}

function normalizeCertificates(value: unknown, fallback: Certificate[]) {
  if (!Array.isArray(value)) {
    return cloneCertificates(fallback);
  }

  const normalized = value
    .filter(isRecord)
    .map((item) => ({
      title: normalizeString(item.title, ""),
      website: normalizeString(item.website, ""),
      href: normalizeString(item.href, "#"),
      image: normalizeString(item.image, "/certificate-ux-strategy.svg"),
      issued: normalizeString(item.issued, ""),
    }))
    .filter((item) => item.title && item.website);

  return normalized.length > 0 ? normalized : cloneCertificates(fallback);
}

function normalizeContactIcon(value: unknown, fallback: ContactIconName): ContactIconName {
  if (typeof value !== "string") {
    return fallback;
  }

  switch (value) {
    case "email":
    case "phone":
    case "location":
    case "linkedin":
    case "github":
    case "website":
      return value;
    default:
      return fallback;
  }
}

function normalizeContactMethodKind(value: unknown): ContactMethodKind {
  return value === "resume" ? "resume" : "contact";
}

function normalizeContactMethods(value: unknown, fallback: ContactMethod[]) {
  if (!Array.isArray(value)) {
    return cloneContactMethods(fallback);
  }

  const normalized = value
    .filter(isRecord)
    .map((item, index) => ({
      label: normalizeString(item.label, ""),
      value: normalizeString(item.value, ""),
      href: normalizeString(item.href, "#"),
      icon: normalizeContactIcon(item.icon, fallback[index]?.icon || "website"),
      kind: normalizeContactMethodKind(item.kind),
    }))
    .filter((item) => item.label && item.value);

  return normalized.length > 0 ? normalized : cloneContactMethods(fallback);
}

function normalizeHeroContacts(value: unknown, fallback: HeroContact[]) {
  if (!Array.isArray(value)) {
    return cloneHeroContacts(fallback);
  }

  const normalized = value
    .filter(isRecord)
    .map((item, index) => ({
      label: normalizeString(item.label, fallback[index]?.label || ""),
      href: normalizeString(item.href, fallback[index]?.href || "#"),
      icon: normalizeContactIcon(item.icon, fallback[index]?.icon || "website"),
    }))
    .filter((item) => item.label && item.href && item.href !== "#");

  return normalized;
}

export function normalizePortfolioContent(
  row: Partial<PortfolioRow> | null | undefined,
  seed: PortfolioSeed = {},
): PortfolioContent {
  const fallback = buildDefaultPortfolioContent(seed);
  const normalizedSlug = sanitizePortfolioSlug(row?.portfolio_slug || fallback.portfolioSlug);
  const normalizedContactMethods = normalizeContactMethods(
    row?.contact_methods,
    fallback.contactMethods,
  );
  const fallbackHeroContacts =
    row?.hero_contacts === undefined || row?.hero_contacts === null
      ? buildHeroContactsFromContactMethods(normalizedContactMethods)
      : fallback.heroContacts;

  return {
    portfolioSlug: normalizedSlug || fallback.portfolioSlug,
    ownerName: normalizeString(row?.owner_name, fallback.ownerName),
    headline: normalizeString(row?.headline, fallback.headline),
    intro: normalizeString(row?.intro, fallback.intro),
    aboutBio: normalizeString(row?.about_bio, fallback.aboutBio),
    aboutImage: normalizeString(row?.about_image, fallback.aboutImage),
    roleTitle: normalizeString(row?.role_title, fallback.roleTitle),
    specialty: normalizeString(row?.specialty, fallback.specialty),
    contactMessage: normalizeString(row?.contact_message, fallback.contactMessage),
    isPublished:
      typeof row?.is_published === "boolean" ? row.is_published : fallback.isPublished,
    navItems: fallback.navItems.map((item) => ({ ...item })),
    heroStats: normalizeHeroStats(row?.hero_stats, fallback.heroStats),
    capabilities: normalizeCapabilities(row?.capabilities, fallback.capabilities),
    projects: normalizeProjects(row?.projects, fallback.projects),
    certificates: normalizeCertificates(row?.certificates, fallback.certificates),
    heroContacts: normalizeHeroContacts(row?.hero_contacts, fallbackHeroContacts),
    contactMethods: normalizedContactMethods,
  };
}

export function createPortfolioUpsertPayload(
  ownerId: string,
  portfolio: PortfolioContent,
): PortfolioUpsertPayload {
  const normalized = normalizePortfolioContent(
    {
      portfolio_slug: portfolio.portfolioSlug,
      owner_name: portfolio.ownerName,
      headline: portfolio.headline,
      intro: portfolio.intro,
      about_bio: portfolio.aboutBio,
      about_image: portfolio.aboutImage,
      role_title: portfolio.roleTitle,
      specialty: portfolio.specialty,
      contact_message: portfolio.contactMessage,
      is_published: portfolio.isPublished,
      hero_stats: portfolio.heroStats,
      capabilities: portfolio.capabilities,
      projects: portfolio.projects,
      certificates: portfolio.certificates,
      hero_contacts: portfolio.heroContacts,
      contact_methods: portfolio.contactMethods,
    },
    { ownerName: portfolio.ownerName },
  );

  return {
    owner_id: ownerId,
    portfolio_slug: normalized.portfolioSlug,
    owner_name: normalized.ownerName,
    headline: normalized.headline,
    intro: normalized.intro,
    about_bio: normalized.aboutBio,
    about_image: normalized.aboutImage,
    role_title: normalized.roleTitle,
    specialty: normalized.specialty,
    contact_message: normalized.contactMessage,
    is_published: normalized.isPublished,
    hero_stats: normalized.heroStats,
    capabilities: normalized.capabilities,
    projects: normalized.projects,
    certificates: normalized.certificates,
    hero_contacts: normalized.heroContacts,
    contact_methods: normalized.contactMethods,
  };
}

export function findPrimaryEmail(contactMethods: ContactMethod[]) {
  return contactMethods.find(
    (item) => item.icon === "email" && !isResumeContactMethod(item),
  );
}

export function findResumeContact(contactMethods: ContactMethod[]) {
  return contactMethods.find(
    (item) => isResumeContactMethod(item) && item.href.trim() && item.href.trim() !== "#",
  );
}
