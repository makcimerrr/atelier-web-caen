import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { SavedSiteSummary } from "@/app/types/builder";

const DATA_DIR = path.join(process.cwd(), "app/data/sites");
const INDEX_FILE = path.join(DATA_DIR, "index.json");

// GET - Retrieve a specific site by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const filePath = path.join(DATA_DIR, `${id}.json`);
    const data = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }
}

// DELETE - Delete a specific site by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const filePath = path.join(DATA_DIR, `${id}.json`);

    // Delete the site file
    await fs.unlink(filePath);

    // Update the index
    const indexData = await fs.readFile(INDEX_FILE, "utf-8");
    const index: SavedSiteSummary[] = JSON.parse(indexData);
    const updatedIndex = index.filter((site) => site.id !== id);
    await fs.writeFile(INDEX_FILE, JSON.stringify(updatedIndex, null, 2));

    return NextResponse.json({ success: true, message: "Site supprime" });
  } catch (error) {
    console.error("Error deleting site:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
