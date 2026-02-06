import JSZip from "jszip";

export async function generateZip(
  html: string,
  css: string,
  js: string,
  readme: string,
  siteName: string
): Promise<Buffer> {
  const zip = new JSZip();

  // Add files to ZIP
  zip.file("index.html", html);
  zip.file("styles.css", css);
  zip.file("script.js", js);
  zip.file("README.txt", readme);

  // Generate ZIP as buffer
  const zipBlob = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });

  return zipBlob;
}

export function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) || "mon-site";
}
