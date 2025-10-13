import type { BlogStatus } from "@prisma/client";

export type BlogMetadata = {
  focusKeyphrase: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  tags?: string;
  midjourneyPrompt?: string;
  sourceLink?: string | null;
};

export type BlogFormState = {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  focusKeyphrase: string;
  metaTitle: string;
  metaDescription: string;
  tags?: string;
  midjourneyPrompt?: string;
  sourceLink?: string | null;
  toneOfVoice?: string;
  goal?: string;
  primaryKeyword: string;
  extraKeywords?: string;
  status: BlogStatus;
};

export type AiBlogResult = {
  content: string;
  metadata: BlogMetadata & {
    extraKeywords?: string;
  };
};
