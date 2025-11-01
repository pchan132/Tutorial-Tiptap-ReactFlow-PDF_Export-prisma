"use client";
import { useState } from "react";
import TiptapEditor from "@/components/TiptapEditor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
interface TypeNote {
  title: string;
  content: any; // tiptap ส่ง JSON object กลับมา ใช้ any ไปก่อนก็ได้
}

export default function page() {
  const [note, setNote] = useState<TypeNote>({
    title: "Untitled Note",
    content: {},
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: note.title, content: note.content }),
      });
      if (!response.ok) {
        throw new Error("Failed to create note");
      }
      const data = await response.json();
      console.log("Note created:", data);
    } catch (error) {
      console.error("Error creating note:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-6">
        <div className="flex justify-between mb-2">
          <h1 className="text-xl font-bold mb-4">📝 Create a Note</h1>
          <Link
            href={`/`}
            className="flex p-3 border-amber-300 border w-[100px]"
          >
            <ArrowLeft />
            Back
          </Link>
        </div>

        <form>
          {/* Title Input */}
          <input
            type="text"
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            className="border p-2 w-full rounded"
            placeholder="Note title..."
          />

          <TiptapEditor
            content={note.content}
            onChange={(content) => setNote({ ...note, content })}
          />

          <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Saving..." : "Save Note"}
          </button>
        </form>

        <pre className="bg-gray-100 p-2 mt-4 rounded text-sm">
          {JSON.stringify(note.content, null, 2)}
        </pre>
      </div>
    </div>
  );
}
