interface Project {
  code: string;
  name: string;
  kind: string;
  summary: string;
  image: string;
  alt: string;
}

export const projects: Project[] = [
  {
    code: "01",
    name: "Coffee",
    kind: "Restaurant",
    summary: "Menu, bakery and shop in one warm, image-first site.",
    image: "/work/project-coffee.webp",
    alt: "Coffee website hero showing coffee pouring into a cup with menu categories",
  },
  {
    code: "02",
    name: "Tweet",
    kind: "Social",
    summary: "Post without your name — accounts, feed and reactions.",
    image: "/work/project-tweet.webp",
    alt: "Tweet landing page reading Speak Freely. Stay Anonymous.",
  },
  {
    code: "03",
    name: "DLT",
    kind: "Builder",
    summary: "A drag-and-drop link-in-bio that actually feels like you. V1.0 live.",
    image: "/work/project-devlinktree.webp",
    alt: "DevLinkTree landing page reading Elevate your digital presence",
  },
  {
    code: "04",
    name: "One-Time Msg",
    kind: "Security",
    summary: "Secrets on a single-use link. AES-256, no logs, on Appwrite.",
    image: "/work/project-onetime.webp",
    alt: "One-Time Msg landing page reading Send Secrets That Self-Destruct",
  },
];
