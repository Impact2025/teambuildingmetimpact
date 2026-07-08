import { ImageResponse } from "next/og";

import { getPublishedBlogBySlug } from "@/lib/blogs";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Teambuilding met Impact";

// Warm amber brand palette
const AMBER = "#e5a500";
const AMBER_DARK = "#b97f00";
const INK = "#1f2937";
const CREAM = "#fffaf0";

export default async function OpengraphImage({
  params,
}: {
  params: { slug: string };
}) {
  const blog = await getPublishedBlogBySlug(params.slug);

  const title = blog?.metaTitle ?? blog?.title ?? "Teambuilding met Impact";
  // Keep the share card readable: trim very long titles
  const displayTitle =
    title.length > 90 ? title.slice(0, 87).trimEnd() + "…" : title;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: CREAM,
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* top amber band */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "10px",
              backgroundColor: AMBER,
            }}
          />
          <div
            style={{
              fontSize: "34px",
              fontWeight: 800,
              color: AMBER_DARK,
              letterSpacing: "-0.5px",
            }}
          >
            Teambuilding met Impact
          </div>
        </div>

        {/* center title */}
        <div
          style={{
            display: "flex",
            fontSize: "68px",
            fontWeight: 800,
            color: INK,
            lineHeight: 1.08,
            letterSpacing: "-1.5px",
            maxWidth: "1000px",
          }}
        >
          {displayTitle}
        </div>

        {/* bottom tagline + accent */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              color: "#6b7280",
              fontWeight: 600,
            }}
          >
            Maatschappelijke teamdagen die écht iets opleveren
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "120px",
                height: "10px",
                borderRadius: "6px",
                backgroundColor: AMBER,
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
