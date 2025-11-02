# Tiptap Document System & React Flow Tutorial

This project demonstrates a comprehensive document management system built with Tiptap editor, Next.js, and React Flow integration.

## Features

### Document Management System
- 📝 **Advanced Rich Text Editor** with Tiptap
- 📄 **Multi-page Document Support**
- 💾 **Database Storage** with PostgreSQL
- 📥 **PDF Export** functionality
- 🔄 **Auto-save** every 3 seconds
- 🎨 **Modern UI** with Tailwind CSS

### React Flow Integration
- 🔄 **Workflow Visualization**
- 📊 **Custom Node Types**
- 🔗 **Interactive Connections**

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
```

3. **Configure database:**
```bash
npx prisma migrate dev
npx prisma generate
```

4. **Start development server:**
```bash
npm run dev
```

5. **Open your browser:**
```
http://localhost:3000
```

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── documents/          # Document API routes
│   │   └── notes/             # Notes API routes
│   ├── documents/             # Document management pages
│   │   ├── page.tsx           # Document list
│   │   ├── globals.css        # Document editor styles
│   │   └── [id]/edit/         # Document editor
│   ├── flowchart/             # React Flow examples
│   ├── notelist/              # Notes management
│   └── test-note/             # Note testing
├── components/
│   ├── DocumentEditor.tsx     # Advanced document editor
│   ├── TiptapEditor.tsx       # Basic Tiptap editor
│   └── custom-nodes/         # React Flow custom nodes
├── lib/
│   ├── pdfExport.ts           # PDF export utilities
│   ├── prisma.ts              # Database connection
│   └── utils.ts               # Helper functions
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
└── DOCUMENTATION.md           # Detailed documentation
```

## Document System Features

### Rich Text Editing
- **Text Formatting**: Bold, Italic, Underline
- **Headings**: H1, H2, H3
- **Lists**: Bullet and numbered lists
- **Tables**: Create and edit tables
- **Links**: Add and manage links
- **Images**: Insert images
- **Text Alignment**: Left, center, right, justify
- **Blockquotes**: Quote sections
- **Character Count**: Track words and characters

### Page Management
- **Multi-page Support**: Create documents with multiple pages
- **Page Navigation**: Easy switching between pages
- **Add/Delete Pages**: Dynamic page management
- **Page Numbers**: Automatic page numbering

### Export Capabilities
- **PDF Export**: High-quality PDF generation
- **Format Preservation**: Maintains styling and layout
- **Multiple Methods**: HTML-to-canvas and text-based export

### Auto-save System
- **Automatic Saving**: Saves every 3 seconds
- **Manual Save**: Save button for immediate saving
- **Save Status**: Visual feedback for save operations

## API Routes

### Document Management
- `GET /api/documents` - List all documents
- `POST /api/documents` - Create new document
- `GET /api/documents/[id]` - Get specific document
- `PUT /api/documents/[id]` - Update document
- `DELETE /api/documents/[id]` - Delete document

### Notes Management
- `GET /api/notes` - List all notes
- `POST /api/notes` - Create new note
- `GET /api/notes/[id]` - Get specific note
- `PUT /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note

## Database Schema

### Document Model
```prisma
model Document {
  id          String   @id @default(cuid())
  title       String
  content     Json
  pageCount   Int      @default(1)
  metadata    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Note Model
```prisma
model Note {
  id        String   @id @default(cuid())
  title     String
  content   Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Usage Examples

### Creating a New Document
1. Navigate to `/documents`
2. Click "New Document"
3. Enter document title
4. Start writing content
5. System auto-saves every 3 seconds

### Exporting to PDF
1. Open any document
2. Click "Export PDF" button
3. Wait for processing
4. PDF downloads automatically

### Using React Flow
1. Navigate to `/flowchart`
2. Drag and drop nodes
3. Create connections
4. Customize node properties

## Development

### Adding New Tiptap Extensions
```typescript
// In components/DocumentEditor.tsx
import NewExtension from "@tiptap/extension-new-extension";

const editor = useEditor({
  extensions: [
    // ... existing extensions
    NewExtension,
  ],
});
```

### Customizing PDF Export
```typescript
// In lib/pdfExport.ts
export function customPDFExport(document: Document) {
  // Custom export logic
}
```

### Adding New API Routes
```typescript
// In app/api/new-feature/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello World" });
}
```

## Dependencies

### Core Dependencies
- **Next.js 16**: React framework
- **React 19**: UI library
- **Tiptap**: Rich text editor
- **Prisma**: Database ORM
- **PostgreSQL**: Database
- **Tailwind CSS**: Styling

### Document System
- **jsPDF**: PDF generation
- **html2canvas**: HTML to image conversion
- **Lucide React**: Icons

### React Flow
- **@xyflow/react**: Flow chart library

## Documentation

For detailed documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.