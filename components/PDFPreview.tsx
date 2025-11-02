// components/PDFPreview.tsx
"use client";

import { useState } from "react";
import { Download, Eye } from "lucide-react";
import { exportToPDF } from "@/lib/pdf-export";

interface Props {
  title: string;
  content: any; // Tiptap JSON content
  onExport?: () => void;
}

export default function PDFPreview({ title, content, onExport }: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // แปลง Tiptap JSON เป็น HTML
  const renderContent = () => {
    if (!content || !content.content) return "<div>ไม่มีเนื้อหา</div>";

    const renderNode = (node: any): string => {
      if (node.type === "heading" && node.attrs?.level) {
        const level = node.attrs.level;
        return `<h${level}>${
          node.content?.map(renderNode).join("") || ""
        }</h${level}>`;
      }

      if (node.type === "paragraph") {
        return `<p>${node.content?.map(renderNode).join("") || ""}</p>`;
      }

      if (node.type === "text") {
        return node.text || "";
      }

      if (node.type === "bold") {
        return `<strong>${
          node.content?.map(renderNode).join("") || ""
        }</strong>`;
      }

      if (node.type === "italic") {
        return `<em>${node.content?.map(renderNode).join("") || ""}</em>`;
      }

      if (node.type === "bulletList") {
        return `<ul>${node.content?.map(renderNode).join("") || ""}</ul>`;
      }

      if (node.type === "orderedList") {
        return `<ol>${node.content?.map(renderNode).join("") || ""}</ol>`;
      }

      if (node.type === "listItem") {
        return `<li>${node.content?.map(renderNode).join("") || ""}</li>`;
      }

      if (node.type === "blockquote") {
        return `<blockquote>${
          node.content?.map(renderNode).join("") || ""
        }</blockquote>`;
      }

      return "";
    };

    return content.content.map(renderNode).join("");
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToPDF("pdf-content", `${title}.pdf`);
      onExport?.();
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการส่งออก PDF: " + error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* ปุ่มควบคุม */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Eye size={16} />
          {showPreview ? "ซ่อนตัวอย่าง" : "ดูตัวอย่าง PDF"}
        </button>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          <Download size={16} />
          {isExporting ? "กำลังส่งออก..." : "ส่งออก PDF"}
        </button>
      </div>

      {/* ตัวอย่าง PDF */}
      {showPreview && (
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-2 text-sm text-gray-600">
            ตัวอย่าง PDF (จะถูกส่งออกในรูปแบบนี้)
          </div>
          <div
            id="pdf-content"
            className="bg-white p-8 max-w-4xl mx-auto pdf-export-fix"
            style={{
              minHeight: "400px",
              margin: "20mm", // margins 20mm รอบด้านเหมือน PDF
              padding: "20mm" // padding 20mm รอบด้าน
            }}
          >
            {/* Header */}
            <div className="mb-6 pb-4 border-b">
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
              <p className="text-sm text-gray-500 mt-2">
                สร้างเมื่อ: {new Date().toLocaleDateString("th-TH")}
              </p>
            </div>

            {/* Content */}
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: renderContent(),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
