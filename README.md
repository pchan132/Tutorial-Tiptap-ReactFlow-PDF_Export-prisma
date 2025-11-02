# 📝 Tiptap + ReactFlow + PDF Export + Prisma Tutorial

โปรเจคนี้สอนการสร้างระบบจัดการโน๊ตด้วย Tiptap Editor และส่งออก PDF พร้อมฐานข้อมูล Prisma

## 🚀 Features ที่มี

### ✅ สำเร็จแล้ว
- **📝 Tiptap Editor** - โปรแกรมแก้ไขข้อความขั้นสูง
  - รองรับ: Bold, Italic, Heading (H1, H2), Bullet List, Ordered List, Blockquote
  - แสดงผลแบบ Real-time
  - บันทึกเป็น JSON format

- **💾 Prisma + PostgreSQL** - ระบบจัดการฐานข้อมูล
  - บันทึก/แก้ไข/ลบ โน๊ต
  - API Routes สำหรับ CRUD operations
  - Database migrations พร้อมใช้

- **📄 PDF Export** - ส่งออกโน๊ตเป็น PDF
  - Preview ก่อน export
  - รองรับเนื้อหาหลายหน้า (multi-page)
  - Margins 20mm รอบด้าน
  - แก้ปัญหา Tailwind CSS 4 + html2canvas

- **📊 React Flow** - ไดอะแกรม workflow
  - Custom nodes (Start, Process, Decision)
  - Payment workflow example
  - Interactive flowchart

### 🛠️ เทคโนโลยีที่ใช้
- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS 4, Chakra UI
- **Editor:** Tiptap 3.10.0
- **Database:** Prisma 6.18.0, PostgreSQL
- **PDF:** jsPDF 3.0.3, html2canvas 1.4.1
- **Flowchart:** ReactFlow 12.9.2

## 📁 โครงสร้างโปรเจค

```
tiptap-ReactFlow-PDF_tutorial/
├── app/                          # Next.js App Router
│   ├── api/notes/               # API Routes สำหรับโน๊ต
│   ├── export/[id]/            # หน้า export PDF
│   ├── notelist/               # หน้ารายการโน๊ต
│   ├── test-note/             # หน้าสร้าง/แก้ไขโน๊ต
│   └── flowchart/             # หน้า React Flow
├── components/                    # React Components
│   ├── TiptapEditor.tsx     # Tiptap Editor Component
│   ├── PDFPreview.tsx        # PDF Export Component
│   └── TableNote.tsx        # ตารางรายการโน๊ต
├── lib/                          # Utility Functions
│   ├── pdf-export.ts        # PDF Export Function
│   └── prisma.ts           # Prisma Client
├── prisma/                       # Database Schema
│   └── schema.prisma       # Prisma Schema
└── PDF_EXPORT_GUIDE.md          # คู่มือ PDF Export
```

## 🎯 การใช้งาน

### 1. สร้างโน๊ตใหม่
1. ไปที่ `/test-note`
2. กรอกหัวข้อ
3. เขียนเนื้อหาด้วย Tiptap Editor
4. คลิก "Save Note"

### 2. จัดการโน๊ต
1. ไปที่ `/notelist`
2. ดูรายการโน๊ตทั้งหมด
3. คลิก "แก้ไข" เพื่อแก้ไข
4. คลิก "📄 PDF" เพื่อ export PDF
5. คลิก "ลบ" เพื่อลบโน๊ต

### 3. Export PDF
1. จากหน้ารายการ: คลิก "📄 PDF"
2. จากหน้าแก้ไข: คลิก "ดูตัวอย่าง PDF" แล้ว "ส่งออก PDF"
3. ระบบจะสร้าง PDF พร้อม margins 20mm

## 🔧 การติดตั้ง

### 1. Clone Repository
```bash
git clone <repository-url>
cd tiptap-ReactFlow-PDF_tutorial
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
สร้างไฟล์ `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database"
DIRECT_URL="postgresql://username:password@localhost:5432/database"
```

### 4. Database Setup
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Run Development Server
```bash
npm run dev
```

เปิด http://localhost:3000

## 📚 คู่มือพิเศษ

- **[PDF_EXPORT_GUIDE.md](PDF_EXPORT_GUIDE.md)** - คู่มือการใช้งานฟีเจอร์ PDF Export อย่างละเอียด
- **API Documentation** - ดูใน `app/api/notes/` สำหรับ API endpoints
- **Database Schema** - ดูใน `prisma/schema.prisma`

## 🐛 ปัญหาที่แก้ไขแล้ว

### 1. Tailwind CSS 4 + html2canvas
- **ปัญหา:** Error "Attempting to parse an unsupported color function 'lab'"
- **วิธีแก้:** เพิ่ม CSS fixes และ ignore elements

### 2. PDF Page Breaks
- **ปัญหา:** คำตัดเมื่อมีเนื้อหาหลายหน้า
- **วิธีแก้:** ใช้วิธีคำนวณใหม่ที่แม่นยำกว่า

### 3. TypeScript Errors
- **ปัญหา:** Type assertion issues
- **วิธีแก้:** ใช้ proper type casting

## 🔄 การพัฒนาต่อ

### Features ที่สามารถเพิ่มได้:
- [ ] รองรับภาษาไทยใน PDF (Thai Font)
- [ ] รองรับรูปภาพในโน๊ต
- [ ] รองรับตารางใน Tiptap
- [ ] เพิ่ม Header/Footer ใน PDF
- [ ] Batch export (export หลายโน๊ตพร้อมกัน)
- [ ] Server-side PDF generation
- [ ] Dark mode support
- [ ] Real-time collaboration
- [ ] Note categories/tags

## 💡 Tips การพัฒนา

### 1. PDF Export
- ใช้ `html2canvas` scale 2 สำหรับความคมชัดสูง
- ปรับ margins ตามต้องการใน `lib/pdf-export.ts`
- แก้ไข CSS สำหรับแก้ปัญหา Tailwind CSS 4

### 2. Tiptap Editor
- เพิ่ม extensions ใหม่: Image, Table, Link
- ปรับแต่ง toolbar ตามความต้องการ
- ใช้ `collaboration` extension สำหรับ real-time

### 3. Performance
- ใช้ React.memo สำหรับ components ที่ไม่เปลี่ยนบ่อย
- Implement pagination สำหรับรายการโน๊ต
- ใช้ lazy loading สำหรับ large content

## 📄 License

MIT License - สามารถนำไปใช้งานได้ทันที

## 🤝 ผู้สนับสนุน

- Next.js Team
- Tiptap Contributors
- Prisma Developers
- ReactFlow Team

---

🎉 **เริ่มต้นสร้างระบบจัดการโน๊ตของคุณได้เลย!**

ถ้ามีข้อสงสัยหรือต้องการคำแนะนำ สามารถติดต่อได้ครับ