import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    console.log("=== API GET NOTE BY ID ===");
    console.log("Fetching note with id:", id);
    
    const note = await prisma.note.findUnique({
      where: {
        id: id,
      },
    });

    if (!note) {
      console.log("Note not found with id:", id);
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    console.log("Note found:", note.title);
    return NextResponse.json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: "Failed to fetch note", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const { title, content } = await req.json();

    console.log("=== API UPDATE NOTE ===");
    console.log("Updating note with id:", id);
    console.log("New title:", title);

    const updatedNote = await prisma.note.update({
      where: {
        id: id,
      },
      data: {
        title,
        content,
      },
    });

    console.log("Note updated successfully:", updatedNote.id);
    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Failed to update note", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    console.log("=== API DELETE NOTE ===");
    console.log("Deleting note with id:", id);

    // ตรวจสอบก่อนว่ามีโน้ตนี้อยู่จริงหรือไม่
    const existingNote = await prisma.note.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingNote) {
      console.log("Note not found for deletion:", id);
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // ลบโน้ต
    await prisma.note.delete({
      where: {
        id: id,
      },
    });

    console.log("Note deleted successfully:", id);
    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}