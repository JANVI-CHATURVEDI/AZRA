import { site } from "@/content/site";

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${site.url}/#organization`,
      name: site.name,
      alternateName: "AZRA Studio",
      description: site.description,
      url: site.url,
      email: site.email,
      slogan: site.tagline,
      image: `${site.url}/og.jpg`,
      logo: `${site.url}/icon.svg`,
      knowsAbout: [
        "Web application development",
        "Next.js and React front-ends",
        "Django backends",
        "Motion design and performance",
        "Search optimisation",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: site.name,
      url: site.url,
      description: site.description,
      inLanguage: "en",
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};
