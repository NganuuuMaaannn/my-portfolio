import {
  FaEnvelope,
  FaGithub,
  FaGlobe,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

import type {
  Capability,
  Certificate,
  ContactMethod,
  HeroStat,
  NavItem,
  Project,
} from "./types";

export const navItems: NavItem[] = [
  { label: "About", id: "about" },
  { label: "Projects", id: "projects" },
  { label: "Certificates", id: "certificates" },
  { label: "Contact", id: "contact" },
];

export const heroStats: HeroStat[] = [
  { value: "06", label: "Dummy project tiles" },
  { value: "04", label: "Certificate previews" },
  { value: "24h", label: "Reply time target" },
];

export const capabilityData: Capability[] = [
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

export const projectData: Project[] = [
  {
    title: "Northstar Commerce Dashboard",
    category: "Web App",
    year: "2026",
    summary:
      "A sales intelligence dashboard for a growing retail team, built to monitor revenue, orders, and campaign performance in one place.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Chart UI"],
    href: "https://example.com/projects/northstar-commerce-dashboard",
    accent: "from-[#0f766e] via-[#14b8a6] to-[#99f6e4]",
  },
  {
    title: "PulseFit Mobile Coach",
    category: "Mobile UX",
    year: "2026",
    summary:
      "A habit-driven fitness app concept with onboarding, personalized routines, and friendly progress feedback for daily motivation.",
    stack: ["React Native", "Figma", "Health Data", "Notifications"],
    href: "https://example.com/projects/pulsefit-mobile-coach",
    accent: "from-[#0f172a] via-[#334155] to-[#cbd5e1]",
  },
  {
    title: "Classroom Connect Portal",
    category: "Education",
    year: "2025",
    summary:
      "A portal for students and teachers to manage assignments, attendance, and announcements with a calm and approachable interface.",
    stack: ["Next.js", "Supabase", "Role Access", "Messaging"],
    href: "https://example.com/projects/classroom-connect-portal",
    accent: "from-[#9a3412] via-[#f97316] to-[#fdba74]",
  },
  {
    title: "Harvest Supply Tracker",
    category: "Operations",
    year: "2025",
    summary:
      "A lightweight inventory tracker for a distribution team with stock alerts, warehouse summaries, and delivery preparation tools.",
    stack: ["Dashboard", "Inventory", "Analytics", "Reports"],
    href: "https://example.com/projects/harvest-supply-tracker",
    accent: "from-[#365314] via-[#65a30d] to-[#d9f99d]",
  },
  {
    title: "Nomad Studio Portfolio Builder",
    category: "Creator Tools",
    year: "2025",
    summary:
      "A drag-and-drop concept for freelancers who want to assemble case studies, testimonials, and contact pages without code.",
    stack: ["CMS", "Blocks", "Branding", "Animations"],
    href: "https://example.com/projects/nomad-studio-portfolio-builder",
    accent: "from-[#7c2d12] via-[#ea580c] to-[#fed7aa]",
  },
  {
    title: "Beacon Support Hub",
    category: "Customer Success",
    year: "2024",
    summary:
      "A support workspace that combines ticket triage, knowledge base content, and SLA tracking for fast internal collaboration.",
    stack: ["Knowledge Base", "Support Ops", "Search", "Workflows"],
    href: "https://example.com/projects/beacon-support-hub",
    accent: "from-[#1d4ed8] via-[#60a5fa] to-[#dbeafe]",
  },
];

export const certificateData: Certificate[] = [
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

export const contactData: ContactMethod[] = [
  {
    label: "Email",
    value: "hello@seanmichael.dev",
    href: "mailto:hello@seanmichael.dev",
    icon: FaEnvelope,
  },
  {
    label: "Phone",
    value: "+63 912 345 6789",
    href: "tel:+639123456789",
    icon: FaPhoneAlt,
  },
  {
    label: "Location",
    value: "Quezon City, Philippines",
    href: "https://maps.google.com/?q=Quezon+City+Philippines",
    icon: FaMapMarkerAlt,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/sean-placeholder",
    href: "https://linkedin.com/in/sean-placeholder",
    icon: FaLinkedin,
  },
  {
    label: "GitHub",
    value: "github.com/sean-placeholder",
    href: "https://github.com/sean-placeholder",
    icon: FaGithub,
  },
  {
    label: "Website",
    value: "seanmichael.example.com",
    href: "https://example.com/seanmichael-portfolio",
    icon: FaGlobe,
  },
];
