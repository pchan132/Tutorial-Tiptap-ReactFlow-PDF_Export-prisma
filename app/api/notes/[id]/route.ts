import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const note = await prisma.note.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.error();
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  // โค้ดสำหรับอัปเดตโน้ต
  try {
    const { title, content } = await req.json();

    const updatedNote = await prisma.note.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.error();
  }
}
