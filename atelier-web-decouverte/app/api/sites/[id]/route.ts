import { NextRequest, NextResponse } from "next/server";
import { readIndex, writeIndex, readSite, deleteSite } from "@/app/lib/storage";

// GET - Retrieve a specific site by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const site = await readSite(id);

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    return NextResponse.json(site);
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

    // Delete the site
    await deleteSite(id);

    // Update the index
    const index = await readIndex();
    const updatedIndex = index.filter((site) => site.id !== id);
    await writeIndex(updatedIndex);

    return NextResponse.json({ success: true, message: "Site supprime" });
  } catch (error) {
    console.error("Error deleting site:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
