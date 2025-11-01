import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    console.log("=== API CREATE NOTE ===");
    console.log("Title:", title);
    console.log("Content type:", typeof content);
    console.log("Content:", content);

    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing title or content" },
        { status: 400 }
      );
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
      },
    });

    console.log("Note created successfully:", note.id);
    return NextResponse.json(note);
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// get All
export async function GET(req: Request) {
  try {
    console.log("=== API GET ALL NOTES ===");
    
    // ตรวจสอบการเชื่อมต่อฐานข้อมูล
    try {
      await prisma.$connect();
      console.log("Database connected successfully");
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }
    
    const notes = await prisma.note.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    console.log("Notes found:", notes.length);
    if (notes.length > 0) {
      console.log("Sample note ID:", notes[0].id);
      console.log("Sample note title:", notes[0].title);
      console.log("Sample note content type:", typeof notes[0].content);
    } else {
      console.log("No notes found in database");
    }
    
    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}