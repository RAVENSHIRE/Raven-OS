export type NavItem = {
  label: string;
  to: string;
};

export type ExperienceItem = {
  title: string;
  company: string;
  period: string;
  description: string;
};

export type PinnedProjectItem = {
  name: string;
  description: string;
  link: string;
  note: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Experience", to: "/experience" },
  { label: "Projects", to: "/projects" },
  { label: "Contact", to: "/contact" },
];

export const HERO = {
  name: "Jay Krayenbuehl",
  tagline: "Data Science Student & FinTech Enthusiast",
};

export const HOME_LANDING = {
  links: [
    { label: "About", to: "/about" },
    { label: "Experience", to: "/experience" },
    { label: "Projects", to: "/projects" },
    { label: "Contact", to: "/contact" },
  ],
};

export const ABOUT = {
  intro: "I'm Jay, a data science student with a practical mindset and a strong focus on clear digital products.",
  aboutMe:
    "I enjoy bridging technology and business to create software that solves real problems. My interests include product thinking, clean interfaces, and data-driven decisions.",
  hobbies:
    "Outside of work and study, I spend time producing music, sketching visual concepts, and experimenting with modern web tools.",
  contactCta: "Get in touch ->",
};

export const BOOT_SCREEN = {
  lines: [
    "RAVEN OS v1.0",
    "Initializing...",
    "Loading kernel... OK",
    "Mounting filesystem... OK",
    "Starting desktop...",
  ],
  durationMs: 3000,
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    title: "Customer Management Intern",
    company: "Swissquote Bank AG",
    period: "Aug 2025 - May 2026",
    description:
      "Supported customer management workflows, coordinated account lifecycle activities, and improved internal communication processes for faster response quality.",
  },
  {
    title: "Client Service & Onboarding Intern",
    company: "CornerTrader S.A.",
    period: "Sep 2024 - Apr 2025",
    description:
      "Handled onboarding-related operations and compliance-facing tasks while collaborating across teams to streamline client onboarding turnaround.",
  },
  {
    title: "Finance & Outsourcing Assistant",
    company: "Truninger - Plot24",
    period: "Jul 2020 - Aug 2021",
    description:
      "Supported invoicing and reporting tasks and helped maintain reliable day-to-day financial operations in a fast-paced environment.",
  },
  {
    title: "Finance & Purchasing Assistant",
    company: "Jelmoli",
    period: "Jul 2018 - Apr 2020",
    description:
      "Worked on payment coordination, supplier communication, and operational purchasing tasks with a focus on consistency and service quality.",
  },
];

export const PINNED_PROJECTS: PinnedProjectItem[] = [
  {
    name: "SQ-Timetracker",
    description: "Professional shift scheduling and swap management for customer care teams.",
    link: "https://github.com/RAVENSHIRE/SQ-Timetracker",
    note: "Production-ready scheduling platform",
  },
  {
    name: "Raven-Worldview-Finance",
    description: "Spatial finance platform merging high-density market data with AI-driven visual storytelling.",
    link: "https://github.com/RAVENSHIRE/Raven-Worldview-Finance",
    note: "3D market intelligence",
  },
  {
    name: "WEBScrFS",
    description: "A ranking-focused project with a concise experimental footprint.",
    link: "https://github.com/RAVENSHIRE/WEBScrFS",
    note: "Pinned utility project",
  },
  {
    name: "Raven-OS",
    description: "Retro Windows 95-style desktop portfolio built with Vite, React Router, and 98.css.",
    link: "https://github.com/RAVENSHIRE/Raven-OS",
    note: "This portfolio",
  },
];
