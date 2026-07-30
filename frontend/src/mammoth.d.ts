// Minimal type declaration for `mammoth` (ships no TypeScript types). We only
// use extractRawText in the browser to pull plain text out of a .docx upload.
declare module 'mammoth' {
  export function extractRawText(input: {
    arrayBuffer: ArrayBuffer;
  }): Promise<{ value: string; messages: unknown[] }>;

  const mammoth: { extractRawText: typeof extractRawText };
  export default mammoth;
}
