import { readFile } from "node:fs/promises";
import path from "node:path";
import { root } from "../../../../lib/store";
const mime: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
};
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string[] }> },
) {
  const { file } = await params;
  if (
    process.env.NODE_ENV !== "development" ||
    file.some(
      (part) =>
        !/^[a-zA-Z0-9._-]+$/.test(part) || part === "." || part === "..",
    )
  )
    return new Response(null, { status: 404 });
  try {
    const target = path.join(root, "public/media", ...file);
    const bytes = await readFile(target);
    return new Response(bytes, {
      headers: {
        "Content-Type":
          mime[path.extname(target)] ?? "application/octet-stream",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
