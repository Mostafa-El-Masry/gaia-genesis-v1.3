import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const IMG = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".bmp",
  ".avif",
]);
const VID = new Set([".mp4", ".webm", ".mov", ".mkv", ".avi"]);

function hashId(p: string) {
  let h = 0,
    i = 0;
  while (i < p.length) {
    h = ((h << 5) - h + p.charCodeAt(i++)) | 0;
  }
  return Math.abs(h).toString(36);
}

async function walk(dir: string): Promise<string[]> {
  try {
    const ents = await fs.readdir(dir, { withFileTypes: true });
    const out: string[] = [];
    for (const e of ents) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) out.push(...(await walk(p)));
      else out.push(p);
    }
    return out;
  } catch {
    return [];
  }
}

export async function GET() {
  const base = process.cwd();
  const media = path.join(base, "public", "media");
  const imgDir = path.join(media, "images");
  const vidDir = path.join(media, "videos");
  const prevDir = path.join(media, "previews");

  const files = [...(await walk(imgDir)), ...(await walk(vidDir))];
  const items = await Promise.all(
    files.map(async (abs) => {
      const rel = abs
        .split(path.join(base, "public"))
        .pop()!
        .replace(/\\/g, "/");
      const ext = path.extname(abs).toLowerCase();
      if (IMG.has(ext))
        return {
          id: hashId(rel),
          type: "image",
          src: rel,
          addedAt: new Date().toISOString(),
        };
      if (VID.has(ext)) {
        const baseName = path.basename(abs, ext);
        const preview: string[] = [];
        for (let i = 1; i <= 6; i++) {
          const name = `${baseName}_thumb_${String(i).padStart(3, "0")}.jpg`;
          try {
            await fs.access(path.join(prevDir, name));
            preview.push(`/media/previews/${name}`);
          } catch {}
        }
        return {
          id: hashId(rel),
          type: "video",
          src: rel,
          preview,
          addedAt: new Date().toISOString(),
        };
      }
      return null;
    })
  );
  return NextResponse.json({ items: items.filter(Boolean) });
}
