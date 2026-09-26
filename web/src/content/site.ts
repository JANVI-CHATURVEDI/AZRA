export const site = {
  name: "AZRA",
  destination: "PRODUCTION",

  email: "janvichaturvedi82@gmail.com",
  location: "Remote · Available worldwide",

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://azra.studio",
  title: "AZRA — Design. Build. Ship.",
  tagline: "Design · Build · Ship",
  description:
    "AZRA designs and builds fast, sharp websites and web apps — one developer, start to launch.",
  footerNote: "Websites and apps, designed and shipped without the bloat.",
  legalLine: "© 2026 AZRA. All rights reserved.",
  signOff: "Please remain seated until the product has come to a complete stop.",
  keywords: [
    "freelance web developer",
    "web app development",
    "Next.js developer",
    "Django backend",
    "hire a developer",
  ],
} as const;

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
] as const;
