/** Content blocks ↔ a single editable text value (one block per line). */
export function blocksFromText(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function textFromBlocks(blocks: string[]): string {
  return blocks.join('\n');
}

/** File extensions we accept for upload. */
export const ACCEPTED_DOC_TYPES = '.txt,.md,.markdown,.docx';

/**
 * Read an uploaded document into content blocks.
 * - `.docx` → extracted with mammoth (in-browser, no server round-trip)
 * - everything else (`.txt`, `.md`, …) → read as plain text
 */
export async function parseDocumentToBlocks(file: File): Promise<string[]> {
  const isDocx = file.name.toLowerCase().endsWith('.docx');
  if (isDocx) {
    // Load the (heavy) docx parser only when a .docx is actually uploaded.
    const mammoth = (await import('mammoth')).default;
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return blocksFromText(value);
  }
  const text = await file.text();
  return blocksFromText(text);
}
