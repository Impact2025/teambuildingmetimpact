import Script from "next/script";

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://www.teambuildingmetimpact.nl/#organization",
        name: "Teambuilding met Impact",
        description:
          "Teambuilding met Impact ontwerpt betekenisvolle teamdagen waarin LEGO® Serious Play en maatschappelijke projecten zorgen voor verbinding, energie en tastbare impact.",
        url: "https://www.teambuildingmetimpact.nl",
        logo: {
          "@type": "ImageObject",
          url: "https://www.teambuildingmetimpact.nl/images/logo.png",
        },
        image: {
          "@type": "ImageObject",
          url: "https://www.teambuildingmetimpact.nl/images/hero-collaboration.png",
        },
        telephone: "+31-XXX-XXXXXX", // VERVANG DOOR JE TELEFOONNUMMER
        email: "info@teambuildingmetimpact.nl", // VERVANG DOOR JE EMAIL
        address: {
          "@type": "PostalAddress",
          addressLocality: "Haarlemmermeer",
          addressRegion: "Noord-Holland",
          addressCountry: "NL",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 52.3081,
          longitude: 4.7585,
        },
        areaServed: {
          "@type": "Country",
          name: "Nederland",
        },
        priceRange: "€€",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "17:00",
          },
        ],
        sameAs: [
          // VOEG HIER JE SOCIAL MEDIA LINKS TOE
          // "https://www.linkedin.com/company/teambuilding-met-impact",
          // "https://www.facebook.com/teambuildingmetimpact",
          // "https://www.instagram.com/teambuildingmetimpact",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://www.teambuildingmetimpact.nl/#website",
        url: "https://www.teambuildingmetimpact.nl",
        name: "Teambuilding met Impact",
        description:
          "Betekenisvolle teambuilding met LEGO® Serious Play en maatschappelijke projecten",
        publisher: {
          "@id": "https://www.teambuildingmetimpact.nl/#organization",
        },
        inLanguage: "nl-NL",
      },
      {
        "@type": "Service",
        serviceType: "Teambuilding",
        provider: {
          "@id": "https://www.teambuildingmetimpact.nl/#organization",
        },
        areaServed: {
          "@type": "Country",
          name: "Nederland",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Teambuilding Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "LEGO® Serious Play Sessies",
                description:
                  "Interactieve teambuildingsessies waarbij teams met LEGO werken aan samenwerking en innovatie",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Teamdagen met Maatschappelijke Impact",
                description:
                  "Combinatie van teambuilding en bijdrage aan maatschappelijke projecten",
              },
            },
          ],
        },
      },
    ],
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
