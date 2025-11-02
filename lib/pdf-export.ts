// lib/pdf-export.ts
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportToPDF(
  elementId: string,
  filename: string = "note.pdf"
) {
  try {
    // 1. หา element ที่ต้องการ export
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error("Element not found");
    }

    // 2. แปลง HTML เป็น Canvas
    const canvas = await html2canvas(element, {
      scale: 1, // ความคมชัด
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      // แก้ปัญหา Tailwind CSS 4 + html2canvas
      ignoreElements: (element) => {
        // ไม่สนใจ elements ที่มีปัญหากับการแปลงเป็นรูปภาพ
        return (
          element.tagName === "STYLE" ||
          (element.tagName === "LINK" &&
            (element as HTMLLinkElement).rel === "stylesheet")
        );
      },
      onclone: (clonedDoc) => {
        // แก้ไขปัญหา CSS ใน cloned document
        const styles = clonedDoc.createElement("style");
        styles.textContent = `
          /* แก้ไขปัญหา color function ที่ html2canvas ไม่รองรับ */
          * {
            color-scheme: light !important;
          }
          
          /* ใช้สีที่เรียบง่ายแทน lab() colors */
          .text-gray-800 { color: #1f2937 !important; }
          .text-gray-500 { color: #6b7280 !important; }
          .text-gray-600 { color: #4b5563 !important; }
          .bg-white { background-color: #ffffff !important; }
          .bg-gray-50 { background-color: #f9fafb !important; }
          .bg-gray-100 { background-color: #f3f4f6 !important; }
          .border-gray-300 { border-color: #d1d5db !important; }
          
          /* ป้องกันปัญหากับ Tailwind CSS 4 */
          @media not print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `;
        clonedDoc.head.appendChild(styles);
      },
    });

    // 3. สร้าง PDF
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // 4. คำนวณขนาดให้พอดีกับกระดาษ A4 พร้อม margins
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 15; // margins 15mm (1.5cm) รอบด้าน
    const imgWidth = pageWidth - margin * 2; // ลบ margins ซ้าย-ขวา
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = margin; // เริ่มต้นที่ margin บน

    // 5. เพิ่มรูปภาพลง PDF พร้อม margins
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2; // ลบ margins บน-ล่าง

    // 6. ถ้าเนื้อหายาวกว่า 1 หน้า ให้เพิ่มหน้าใหม่
    while (heightLeft >= 0) {
      position = margin - (imgHeight - heightLeft); // คำนวณ position ใหม่
      pdf.addPage();
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;
    }

    // 7. บันทึกไฟล์
    pdf.save(filename);
  } catch (error) {
    console.error("Error exporting PDF:", error);
    throw error;
  }
}
