"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PDFPreview from "@/components/PDFPreview";

export default function ExportPage() {
  const params = useParams();
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/notes/${params.id}`);
        const data = await response.json();
        setNote(data);
      } catch (error) {
        console.error("Error fetching note:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchNote();
    }
  }, [params.id]);

  if (loading) {
    return <div className="p-6">กำลังโหลด...</div>;
  }

  if (!note) {
    return <div className="p-6">ไม่พบโน๊ต</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">ส่งออก PDF: {note.title}</h1>

        <PDFPreview
          title={note.title}
          content={note.content}
          onExport={() => {
            setTimeout(() => {
              window.close();
            }, 1000);
          }}
        />
      </div>
    </div>
  );
}
