import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    console.log("=== API GET DOCUMENT BY ID ===");
    console.log("Fetching document with id:", id);
    
    const document = await prisma.document.findUnique({
      where: {
        id: id,
      },
    });

    if (!document) {
      console.log("Document not found with id:", id);
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    console.log("Document found:", document.title);
    return NextResponse.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Failed to fetch document", details: error instanceof Error ? error.message : String(error) },
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
    const { title, content, pageCount, metadata } = await req.json();

    console.log("=== API UPDATE DOCUMENT ===");
    console.log("Updating document with id:", id);
    console.log("New title:", title);

    const updatedDocument = await prisma.document.update({
      where: {
        id: id,
      },
      data: {
        title,
        content,
        pageCount,
        metadata,
      },
    });

    console.log("Document updated successfully:", updatedDocument.id);
    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update document", details: error instanceof Error ? error.message : String(error) },
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

    console.log("=== API DELETE DOCUMENT ===");
    console.log("Deleting document with id:", id);

    // ตรวจสอบก่อนว่ามีเอกสารนี้อยู่จริงหรือไม่
    const existingDocument = await prisma.document.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingDocument) {
      console.log("Document not found for deletion:", id);
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // ลบเอกสาร
    await prisma.document.delete({
      where: {
        id: id,
      },
    });

    console.log("Document deleted successfully:", id);
    return NextResponse.json(
      { message: "Document deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}