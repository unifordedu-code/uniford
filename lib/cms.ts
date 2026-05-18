import { supabase } from "@/lib/supabase";

export type ContentType =
  | "text"
  | "image"
  | "free_text"
  | "free_image"
  | "free_emoji";

export type ContentStyles = {
  width?: string;
  height?: string;
  borderRadius?: string;
  objectFit?: "contain" | "cover";
  fontSize?: string;
  color?: string;
  x?: number;
  y?: number;
  pagePath?: string;
  hidden?: boolean;
};

export type SiteContent = {
  id: string;
  type: ContentType;
  value: string;
  styles?: ContentStyles;
};

const DRAFTS_KEY = "uniford_cms_drafts";

export function makePageKey(pagePath: string) {
  return pagePath.replace(/[^a-zA-Z0-9_-]/g, "_");
}

export async function getContent(id: string, defaultValue: string) {
  const { data } = await supabase
    .from("site_content")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) {
    return {
      id,
      value: defaultValue,
      styles: {},
    };
  }

  return {
    id: data.id,
    value: data.value,
    styles: data.styles || {},
  };
}

export async function getDomEdits(pagePath: string) {
  const pageKey = makePageKey(pagePath);
  const prefix = `dom.${pageKey}.`;

  const { data } = await supabase
    .from("site_content")
    .select("*")
    .like("id", `${prefix}%`);

  if (!data) {
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    type: item.type as ContentType,
    value: item.value,
    styles: item.styles || {},
  }));
}

export async function getFreeElements(pagePath: string) {
  const newPageKey = makePageKey(pagePath);
  const oldPageKey = encodeURIComponent(pagePath);

  const { data: newData } = await supabase
    .from("site_content")
    .select("*")
    .like("id", `free.${newPageKey}.%`);

  const { data: oldData } = await supabase
    .from("site_content")
    .select("*")
    .like("id", `free.${oldPageKey}.%`);

  const allData = [...(newData || []), ...(oldData || [])];

  return allData
    .map((item) => ({
      id: item.id,
      type: item.type as ContentType,
      value: item.value,
      styles: item.styles || {},
    }))
    .filter((item) => !item.styles?.hidden);
}

export function getDrafts(): SiteContent[] {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = localStorage.getItem(DRAFTS_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function setDraft(content: SiteContent) {
  const drafts = getDrafts();
  const filtered = drafts.filter((item) => item.id !== content.id);
  const updated = [content, ...filtered];

  localStorage.setItem(DRAFTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("uniford_cms_drafts_changed"));
}

export function clearDrafts() {
  localStorage.removeItem(DRAFTS_KEY);
  window.dispatchEvent(new Event("uniford_cms_drafts_changed"));
}

export async function saveAllDrafts() {
  const drafts = getDrafts();

  if (drafts.length === 0) {
    return;
  }

  const rows = drafts.map((item) => ({
    id: item.id,
    type: item.type,
    value: item.value,
    styles: item.styles || {},
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("site_content").upsert(rows);

  if (error) {
    throw error;
  }

  clearDrafts();
}