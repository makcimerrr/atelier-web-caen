import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const TEMPLATES_DIR = path.join(process.cwd(), "app/data/templates");

export interface TemplateSummary {
  id: string;
  name: string;
  description: string;
  emoji: string;
  difficulty: "facile" | "moyen" | "difficile";
  tasks: string[];
}

// GET - Liste tous les templates disponibles
export async function GET() {
  try {
    const files = await fs.readdir(TEMPLATES_DIR);
    const templates: TemplateSummary[] = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = path.join(TEMPLATES_DIR, file);
        const data = await fs.readFile(filePath, "utf-8");
        const template = JSON.parse(data);
        templates.push({
          id: template.id,
          name: template.name,
          description: template.description,
          emoji: template.emoji,
          difficulty: template.difficulty,
          tasks: template.tasks,
        });
      }
    }

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error reading templates:", error);
    return NextResponse.json({ error: "Failed to read templates" }, { status: 500 });
  }
}
