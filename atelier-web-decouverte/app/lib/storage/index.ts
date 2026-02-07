import { promises as fs } from "fs";
import path from "path";
import { put, del, list, head } from "@vercel/blob";
import { SavedSite, SavedSiteSummary } from "@/app/types/builder";

const IS_VERCEL = process.env.VERCEL === "1";

// Sites storage paths
const DATA_DIR = path.join(process.cwd(), "app/data/sites");
const INDEX_FILE = path.join(DATA_DIR, "index.json");
const BLOB_PREFIX = "sites/";

// ============ File System Storage (Local Development) ============

async function fsReadIndex(): Promise<SavedSiteSummary[]> {
  try {
    const data = await fs.readFile(INDEX_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function fsWriteIndex(index: SavedSiteSummary[]): Promise<void> {
  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2));
}

async function fsReadSite(id: string): Promise<SavedSite | null> {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function fsWriteSite(site: SavedSite): Promise<void> {
  const filePath = path.join(DATA_DIR, `${site.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(site, null, 2));
}

async function fsDeleteSite(id: string): Promise<void> {
  const filePath = path.join(DATA_DIR, `${id}.json`);
  await fs.unlink(filePath);
}

// ============ Vercel Blob Storage (Production) ============

async function blobReadIndex(): Promise<SavedSiteSummary[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_PREFIX });
    const indexBlob = blobs.find((b) => b.pathname === `${BLOB_PREFIX}index.json`);
    if (!indexBlob) return [];

    const response = await fetch(indexBlob.url);
    return response.json();
  } catch (error) {
    console.error("Error reading index from blob:", error);
    return [];
  }
}

async function blobWriteIndex(index: SavedSiteSummary[]): Promise<void> {
  await put(`${BLOB_PREFIX}index.json`, JSON.stringify(index, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function blobReadSite(id: string): Promise<SavedSite | null> {
  try {
    const blobInfo = await head(`${BLOB_PREFIX}${id}.json`);
    if (!blobInfo) return null;

    const response = await fetch(blobInfo.url);
    return response.json();
  } catch {
    return null;
  }
}

async function blobWriteSite(site: SavedSite): Promise<void> {
  await put(`${BLOB_PREFIX}${site.id}.json`, JSON.stringify(site, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function blobDeleteSite(id: string): Promise<void> {
  try {
    const blobInfo = await head(`${BLOB_PREFIX}${id}.json`);
    if (blobInfo) {
      await del(blobInfo.url);
    }
  } catch (error) {
    console.error("Error deleting site from blob:", error);
  }
}

// ============ Exported Storage Interface ============

export async function readIndex(): Promise<SavedSiteSummary[]> {
  return IS_VERCEL ? blobReadIndex() : fsReadIndex();
}

export async function writeIndex(index: SavedSiteSummary[]): Promise<void> {
  return IS_VERCEL ? blobWriteIndex(index) : fsWriteIndex(index);
}

export async function readSite(id: string): Promise<SavedSite | null> {
  return IS_VERCEL ? blobReadSite(id) : fsReadSite(id);
}

export async function writeSite(site: SavedSite): Promise<void> {
  return IS_VERCEL ? blobWriteSite(site) : fsWriteSite(site);
}

export async function deleteSite(id: string): Promise<void> {
  return IS_VERCEL ? blobDeleteSite(id) : fsDeleteSite(id);
}
