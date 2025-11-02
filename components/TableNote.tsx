"use client";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

interface Note {
  id: string;
  title: string;
  createdAt: string;
}

export default function TableNote() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        console.log("Fetching notes from API...");
        const response = await fetch("/api/notes");
        const data = await response.json();
        console.log("API Response:", data);
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, []);

  //   เมื่อ กดปุ่มแก้ไข
  const handleEdit = (id: string) => {
    console.log("=== EDIT BUTTON CLICKED ===");
    console.log("Edit note with id:", id);
    console.log(
      "Full note object being edited:",
      notes.find((n) => n.id === id)
    );
    console.log("Navigating to:", `/test-note/${id}`);

    // เพิ่มการตรวจสอบว่ามี ID หรือไม่
    if (!id) {
      console.error("No ID provided for editing!");
      alert("เกิดข้อผิดพลาด: ไม่พบ ID ของ Note");
      return;
    }

    router.push(`/test-note/${id}`);
  };

  console.log("=== TABLE NOTE DEBUG ===");
  console.log("Notes in TableNote:", notes);
  console.log("Notes count:", notes.length);

  // Debug: แสดงข้อมูลแถวละ 5 แถวแรก
  if (notes.length > 0) {
    console.log("First 5 notes:", notes.slice(0, 5));
    console.log("Sample note ID:", notes[0]?.id);
    console.log("Sample note title:", notes[0]?.title);
  } else {
    console.log("No notes found!");
  }

  // เพิ่มฟังก์ชัน handleExport
  const handleExport = async (id: string, title: string) => {
    try {
      // ดึงข้อมูลโน๊ต
      const response = await fetch(`/api/notes/${id}`);
      const note = await response.json();

      // เปิดหน้าต่างใหม่สำหรับ export
      const newWindow = window.open(`/export/${id}`, "_blank");
      if (!newWindow) {
        alert("กรุณาอนุญาตให้เปิดป๊อปอัป");
      }
    } catch (error) {
      console.error("Error preparing export:", error);
      alert("เกิดข้อผิดพลาดในการเตรียมข้อมูล");
    }
  };

  // เพิ่มฟังก์ชันลบ
  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบ Note นี้?")) {
      return;
    }

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      alert("ลบ Note เรียบร้อยแล้ว!");
      // โหลดข้อมูลใหม่
      const fetchNotes = async () => {
        try {
          console.log("Fetching notes from API...");
          const response = await fetch("/api/notes");
          const data = await response.json();
          console.log("API Response:", data);
          setNotes(data);
        } catch (error) {
          console.error("Error fetching notes:", error);
        }
      };
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("เกิดข้อผิดพลาดในการลบ กรุณาลองใหม่");
    }
  };

  return (
    <table className="min-w-full border border-gray-300 ">
      <thead>
        <tr className="bg-gray-200 text-center">
          <th>ลำดับ</th>
          <th>ชื่อ</th>
          <th>เวลา</th>
          <th>จัดการ</th>
        </tr>
      </thead>
      <tbody className="text-center">
        {notes.map((note, index) => (
          <tr key={note.id} className="border-t border-gray-300">
            <td className="border-r border-gray-300">{index + 1}</td>
            <td className="border-r border-gray-300">{note.title}</td>
            <td className="border-r border-gray-300">
              {new Date(note.createdAt).toLocaleDateString("th-TH")}{" "}
              {new Date(note.createdAt).toLocaleTimeString("th-TH")}
            </td>
            <td className="flex justify-center gap-2">
              {/* // เพิ่มปุ่มในส่วนของ <td className="flex justify-center gap-2"> */}
              <button
                onClick={() => handleExport(note.id, note.title)}
                className="bg-purple-500 text-white px-4 py-2 rounded m-2 cursor-pointer hover:bg-purple-600"
              >
                📄 PDF
              </button>

              <button
                onClick={() => {
                  console.log("Button clicked for note:", note);
                  handleEdit(note.id);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded m-2 cursor-pointer hover:bg-blue-600"
              >
                แก้ไข
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                className="bg-red-500 text-white px-4 py-2 rounded m-2 cursor-pointer hover:bg-red-600"
              >
                ลบ
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
