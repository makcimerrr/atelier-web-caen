import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const TEMPLATES_DIR = path.join(process.cwd(), "app/data/templates");

// GET - Récupère un template spécifique par son ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const filePath = path.join(TEMPLATES_DIR, `${id}.json`);

    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    const template = JSON.parse(data);

    // Retourne seulement les blocks et settings pour le chargement
    return NextResponse.json({
      id: template.id,
      name: template.name,
      tasks: template.tasks,
      blocks: template.blocks,
      settings: template.settings,
    });
  } catch (error) {
    console.error("Error reading template:", error);
    return NextResponse.json({ error: "Failed to read template" }, { status: 500 });
  }
}
