import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Comment } from "@/app/types/builder";

const DATA_FILE = path.join(process.cwd(), "app/data/comments.json");

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

async function readComments(): Promise<Comment[]> {
  await ensureDataFile();
  const data = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

async function writeComments(comments: Comment[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(comments, null, 2));
}

// GET - Récupérer tous les commentaires
export async function GET() {
  try {
    const comments = await readComments();
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error reading comments:", error);
    return NextResponse.json({ error: "Failed to read comments" }, { status: 500 });
  }
}

// POST - Ajouter un commentaire
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pseudo, message, tag } = body;

    if (!pseudo || !message || !tag) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const comments = await readComments();

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      pseudo: pseudo.trim().slice(0, 30),
      message: message.trim().slice(0, 280),
      tag,
      createdAt: new Date().toISOString(),
    };

    comments.unshift(newComment);
    await writeComments(comments);

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
