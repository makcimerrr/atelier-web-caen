import { NextRequest, NextResponse } from "next/server";
import { SavedSite } from "@/app/types/builder";
import { readIndex, writeIndex, writeSite } from "@/app/lib/storage";

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

    // Save full site data
    await writeSite(newSite);

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
