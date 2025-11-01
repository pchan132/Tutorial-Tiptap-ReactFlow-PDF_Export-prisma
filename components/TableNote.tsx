"use client";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

interface Note {
  id: string;
  title: string;
}

export default function TableNote() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("/api/notes");
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, []);

  //   เมื่อ กดปุ่มแก้ไข
  const handleEdit = (id: string) => {
    console.log("Edit note with id:", id);
    router.push(`/test-note/${id}`);
  };

  console.log("Notes in TableNote:", notes);

  return (
    <table className="min-w-full border border-gray-300 ">
      <thead>
        <tr className="bg-gray-200 text-center">
          <th>ลำดับ</th>
          <th>ชื่อ</th>
          <th>จัดการ</th>
        </tr>
      </thead>
      <tbody className="text-center">
        {notes.map((note, index) => (
          <tr key={note.id} className="border-t border-gray-300">
            <td className="border-r border-gray-300">{index + 1}</td>
            <td className="border-r border-gray-300">{note.title}</td>
            <td className="flex justify-center gap-2">
              <button
                onClick={() => handleEdit(note.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded m-2 cursor-pointer"
              >
                แก้ไข
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded m-2 cursor-pointer">
                ลบ
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
