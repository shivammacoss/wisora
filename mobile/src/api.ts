/** Live Wisora backend — used to fetch admin-authored chapter overrides. */
export const API_BASE = 'https://wisora.org/api/v1';

export interface RemoteChapter {
  title: string | null;
  essence: string | null;
  blocks: string[];
}

/**
 * Fetch admin-authored content for a chapter, if any. Returns null on 404 /
 * empty / network error — the app then falls back to the bundled content.
 */
export async function fetchChapterOverride(
  bookSlug: string,
  chapterOrder: number,
): Promise<RemoteChapter | null> {
  try {
    const res = await fetch(`${API_BASE}/chapters/${bookSlug}/${chapterOrder}`);
    if (!res.ok) return null;
    const json = (await res.json()) as { data: RemoteChapter | null };
    const data = json.data;
    if (data && Array.isArray(data.blocks) && data.blocks.length > 0) return data;
    return null;
  } catch {
    return null;
  }
}
