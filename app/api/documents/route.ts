import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, content, pageCount, metadata } = await req.json();

    console.log("=== API CREATE DOCUMENT ===");
    console.log("Title:", title);
    console.log("Content type:", typeof content);
    console.log("Page count:", pageCount);

    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing title or content" },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        title,
        content,
        pageCount: pageCount || 1,
        metadata: metadata || {},
      },
    });

    console.log("Document created successfully:", document.id);
    return NextResponse.json(document);
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Failed to create document", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Get all documents
export async function GET(req: Request) {
  try {
    console.log("=== API GET ALL DOCUMENTS ===");
    
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
    
    const documents = await prisma.document.findMany({
      select: {
        id: true,
        title: true,
        pageCount: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    console.log("Documents found:", documents.length);
    if (documents.length > 0) {
      console.log("Sample document ID:", documents[0].id);
      console.log("Sample document title:", documents[0].title);
    } else {
      console.log("No documents found in database");
    }
    
    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}