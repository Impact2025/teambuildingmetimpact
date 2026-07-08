/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  async redirects() {
    // Legacy IctusGo slugs -> best-matching new Teambuilding met Impact post (301)
    return [
      {
        source: "/blog/teambuilding-met-impact-betekenisvolle-verandering",
        destination: "/blog/zinvolle-teambuilding-organiseren",
        permanent: true,
      },
      {
        source:
          "/blog/teambuilding-buiten-kantoor-die-je-kunt-meten-maak-kennis-met-ictusgo",
        destination: "/blog/teambuilding-op-plekken-met-een-verhaal",
        permanent: true,
      },
      {
        source:
          "/blog/teambuilding-met-maatschappelijke-impact-zo-maak-je-het-aantoonbaar-voor-je-directie",
        destination: "/blog/maatschappelijke-impact-teamdag-meten",
        permanent: true,
      },
      {
        source: "/blog/gps-teambuilding-haarlemmermeer-ontdek-de-polder-en-maak-echt-impact",
        destination: "/blog/teamdag-die-de-buurt-raakt",
        permanent: true,
      },
      {
        source: "/blog/teambuilding-haarlemmermeer-meer-dan-een-uitje-in-de-polder",
        destination: "/blog/teamdag-die-de-buurt-raakt",
        permanent: true,
      },
      {
        source: "/blog/effectieve-teambuilding-lego-serious-play",
        destination: "/blog/wat-levert-lego-serious-play-op",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
