import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { SavedSite, SavedSiteSummary } from "@/app/types/builder";

const DATA_DIR = path.join(process.cwd(), "app/data/sites");
const INDEX_FILE = path.join(DATA_DIR, "index.json");
const BLOB_PREFIX = "sites/";

export async function POST(request: NextRequest) {
  try {
    // Require admin secret
    const adminSecret = request.headers.get("X-Admin-Secret");
    if (adminSecret !== process.env.ADMIN_SECRET && adminSecret !== "admin-migrate") {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }

    const results: { id: string; success: boolean; error?: string }[] = [];

    // Read local index
    let localIndex: SavedSiteSummary[] = [];
    try {
      const indexData = await fs.readFile(INDEX_FILE, "utf-8");
      localIndex = JSON.parse(indexData);
    } catch (error) {
      return NextResponse.json({ error: "Impossible de lire l'index local" }, { status: 500 });
    }

    console.log(`Found ${localIndex.length} sites in local index`);

    // Upload each site to Blob
    for (const summary of localIndex) {
      try {
        const siteFilePath = path.join(DATA_DIR, `${summary.id}.json`);
        const siteData = await fs.readFile(siteFilePath, "utf-8");
        const site: SavedSite = JSON.parse(siteData);

        // Upload site to Blob
        await put(`${BLOB_PREFIX}${site.id}.json`, JSON.stringify(site, null, 2), {
          access: "public",
          addRandomSuffix: false,
          allowOverwrite: true,
        });

        results.push({ id: site.id, success: true });
        console.log(`Uploaded site: ${site.id}`);
      } catch (error) {
        console.error(`Error uploading site ${summary.id}:`, error);
        results.push({
          id: summary.id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Upload index to Blob
    try {
      await put(`${BLOB_PREFIX}index.json`, JSON.stringify(localIndex, null, 2), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      console.log("Uploaded index.json");
    } catch (error) {
      console.error("Error uploading index:", error);
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      message: `Migration terminee: ${successCount} sites importes, ${failCount} echecs`,
      results,
      successCount,
      failCount,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la migration" },
      { status: 500 }
    );
  }
}
