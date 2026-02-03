import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { SavedSite, SavedSiteSummary, StudentInfo } from "@/app/types/builder";

const DATA_DIR = path.join(process.cwd(), "app/data/sites");
const INDEX_FILE = path.join(DATA_DIR, "index.json");

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
  try {
    await fs.access(INDEX_FILE);
  } catch {
    await fs.writeFile(INDEX_FILE, JSON.stringify([], null, 2));
  }
}

async function readIndex(): Promise<SavedSiteSummary[]> {
  await ensureDataDir();
  const data = await fs.readFile(INDEX_FILE, "utf-8");
  return JSON.parse(data);
}

async function writeIndex(index: SavedSiteSummary[]): Promise<void> {
  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2));
}

// GET - List all saved sites (summary only)
export async function GET() {
  try {
    const index = await readIndex();
    return NextResponse.json(index);
  } catch (error) {
    console.error("Error reading sites index:", error);
    return NextResponse.json({ error: "Failed to read sites" }, { status: 500 });
  }
}

// POST - Save a new site
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentInfo, blocks, settings } = body;

    if (!studentInfo?.nom || !studentInfo?.prenom || !studentInfo?.email) {
      return NextResponse.json(
        { error: "Missing required student information" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentInfo.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    await ensureDataDir();

    const newSite: SavedSite = {
      id: `site-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      studentInfo: {
        nom: studentInfo.nom.trim().slice(0, 50),
        prenom: studentInfo.prenom.trim().slice(0, 50),
        email: studentInfo.email.trim().toLowerCase().slice(0, 100),
      },
      blocks,
      settings,
      createdAt: new Date().toISOString(),
    };

    // Save full site data to individual file
    await fs.writeFile(
      path.join(DATA_DIR, `${newSite.id}.json`),
      JSON.stringify(newSite, null, 2)
    );

    // Update index
    const index = await readIndex();
    index.unshift({
      id: newSite.id,
      studentInfo: newSite.studentInfo,
      createdAt: newSite.createdAt,
    });
    await writeIndex(index);

    return NextResponse.json({ id: newSite.id, message: "Site saved successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error saving site:", error);
    return NextResponse.json({ error: "Failed to save site" }, { status: 500 });
  }
}
