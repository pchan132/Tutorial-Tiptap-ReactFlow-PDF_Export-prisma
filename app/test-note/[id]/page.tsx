"use client";
import React, { useState, useEffect } from "react";
import TiptapEditor from "@/components/TiptapEditor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface TypeNote {
  title: string;
  content: any; // tiptap ส่ง JSON object กลับมา ใช้ any ไปก่อนก็ได้
}

export default function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [note, setNote] = useState<TypeNote>({
    title: "Untitled Note",
    content: {},
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const router = useRouter();

  // Unwrap params ด้วย React.use() สำหรับ Next.js 15
  const resolvedParams = React.use(params);
  const noteId = resolvedParams.id;

  // ดึงข้อมูล Note เมื่อโหลดหน้า
  useEffect(() => {
    const fetchNote = async () => {
      try {
        setFetchLoading(true);
        console.log("Fetching note with id:", noteId);
        const response = await fetch(`/api/notes/${noteId}`);

        if (!response.ok) {
          throw new Error("Note not found");
        }

        const data = await response.json();
        setNote({
          title: data.title || "Untitled Note",
          content: data.content || {},
        });
      } catch (error) {
        console.error("Error fetching note:", error);
        // ถ้าไม่เจอ Note ให้กลับไปหน้ารายการ
        // router.push("/test-note");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchNote();
  }, [noteId, router]);

  // ฟังก์ชันบันทึกการแก้ไข
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: note.title,
          content: note.content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      const data = await response.json();
      console.log("Note updated:", data);

      // แสดงข้อความสำเร็จและกลับไปหน้ารายการ
      alert("บันทึกการแก้ไขเรียบร้อยแล้ว!");
      router.push("/notelist");
    } catch (error) {
      console.error("Error updating note:", error);
      alert("เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันลบ Note
  const handleDelete = async () => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบ Note นี้?")) {
      return;
    }

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      alert("ลบ Note เรียบร้อยแล้ว!");
      router.push("/test-note");
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("เกิดข้อผิดพลาดในการลบ กรุณาลองใหม่");
    }
  };

  if (fetchLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p>กำลังโหลดข้อมูล Note...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold">✏️ แก้ไข Note</h1>
          <div className="flex gap-2">
            <Link
              href="/test-note"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              <ArrowLeft size={16} />
              กลับ
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              🗑️ ลบ
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              หัวข้อ Note:
            </label>
            <input
              type="text"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ใส่หัวข้อ Note..."
              required
            />
          </div>

          {/* Content Editor */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">เนื้อหา:</label>
            <TiptapEditor
              content={note.content}
              onChange={(content) => setNote({ ...note, content })}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "กำลังบันทึก..." : "💾 บันทึกการแก้ไข"}
            </button>

            <Link
              href="/test-note"
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-center"
            >
              ยกเลิก
            </Link>
          </div>
        </form>

        {/* Debug Section - แสดงข้อมูลสำหรับการตรวจสอบ */}
        <div className="mt-6">
          <details className="bg-gray-100 p-4 rounded">
            <summary className="cursor-pointer font-medium">
              🔍 ดูข้อมูล Debug
            </summary>
            <div className="mt-2">
              <p>
                <strong>Note ID:</strong> {noteId}
              </p>
              <p>
                <strong>Title:</strong> {note.title}
              </p>
              <pre className="bg-white p-2 mt-2 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(note.content, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
