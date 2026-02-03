import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const EXAMPLE_FILE = path.join(process.cwd(), "app/data/example-config.json");

export async function GET() {
  try {
    const data = await fs.readFile(EXAMPLE_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error("Error reading example config:", error);
    return NextResponse.json({ error: "Example config not found" }, { status: 404 });
  }
}
