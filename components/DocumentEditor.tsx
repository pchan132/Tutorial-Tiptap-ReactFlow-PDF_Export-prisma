"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { useState, useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Link as LinkIcon,
  Table as TableIcon,
  Undo,
  Redo,
  Plus,
  Trash2,
  Download,
} from "lucide-react";

interface Page {
  id: string;
  content: any;
}

interface Document {
  id: string;
  title: string;
  pages: Page[];
  metadata: any;
}

interface Props {
  document?: Document;
  onChange: (document: Document) => void;
  onExportPDF?: () => void;
}

export default function DocumentEditor({
  document,
  onChange,
  onExportPDF,
}: Props) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [documentTitle, setDocumentTitle] = useState(
    document?.title || "Untitled Document"
  );

  // Initialize pages if not provided
  const [pages, setPages] = useState<Page[]>(
    document?.pages || [{ id: "1", content: { type: "doc", content: [] } }]
  );

  // Create editor for current page
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto",
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CharacterCount,
      Placeholder.configure({
        placeholder: "Start typing your content here...",
      }),
    ],
    content: pages[currentPageIndex]?.content || { type: "doc", content: [] },
    immediatelyRender: false,
    editable: true,
    onUpdate: ({ editor }) => {
      const updatedPages = [...pages];
      updatedPages[currentPageIndex] = {
        ...updatedPages[currentPageIndex],
        content: editor.getJSON(),
      };
      setPages(updatedPages);

      onChange({
        id: document?.id || "",
        title: documentTitle,
        pages: updatedPages,
        metadata: document?.metadata || {},
      });
    },
  });

  // Update editor content when page changes
  useEffect(() => {
    if (editor && pages[currentPageIndex]) {
      editor.commands.setContent(pages[currentPageIndex].content);
    }
  }, [currentPageIndex, editor, pages]);

  const addNewPage = useCallback(() => {
    const newPage: Page = {
      id: Date.now().toString(),
      content: { type: "doc", content: [] },
    };
    const updatedPages = [...pages, newPage];
    setPages(updatedPages);
    setCurrentPageIndex(updatedPages.length - 1);
  }, [pages]);

  const deleteCurrentPage = useCallback(() => {
    if (pages.length <= 1) return; // Don't delete the last page

    const updatedPages = pages.filter((_, index) => index !== currentPageIndex);
    setPages(updatedPages);
    setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
  }, [pages, currentPageIndex]);

  const switchPage = useCallback(
    (pageIndex: number) => {
      if (pageIndex >= 0 && pageIndex < pages.length) {
        setCurrentPageIndex(pageIndex);
      }
    },
    [pages.length]
  );

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt("Image URL");

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const insertTable = useCallback(() => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  const addColumn = useCallback(() => {
    editor?.chain().focus().addColumnAfter().run();
  }, [editor]);

  const deleteColumn = useCallback(() => {
    editor?.chain().focus().deleteColumn().run();
  }, [editor]);

  const addRow = useCallback(() => {
    editor?.chain().focus().addRowAfter().run();
  }, [editor]);

  const deleteRow = useCallback(() => {
    editor?.chain().focus().deleteRow().run();
  }, [editor]);

  const deleteTable = useCallback(() => {
    editor?.chain().focus().deleteTable().run();
  }, [editor]);

  const toggleHeaderColumn = useCallback(() => {
    editor?.chain().focus().toggleHeaderColumn().run();
  }, [editor]);

  const toggleHeaderRow = useCallback(() => {
    editor?.chain().focus().toggleHeaderRow().run();
  }, [editor]);

  const toggleHeaderCell = useCallback(() => {
    editor?.chain().focus().toggleHeaderCell().run();
  }, [editor]);

  if (!editor) return <div>Loading editor...</div>;

  return (
    <div className="flex flex-col h-full">
      {/* Document Title */}
      <div className="border-b p-4">
        <input
          type="text"
          value={documentTitle}
          onChange={(e) => setDocumentTitle(e.target.value)}
          className="text-2xl font-bold w-full border-none outline-none"
          placeholder="Document Title"
        />
      </div>

      {/* Toolbar */}
      <div className="border-b p-2 flex gap-2 flex-wrap bg-gray-50">
        {/* Undo/Redo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="px-3 py-1 rounded text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          type="button"
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="px-3 py-1 rounded text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          type="button"
          title="Redo"
        >
          <Redo size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive("bold") ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          type="button"
          title="Bold"
        >
          <Bold size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive("italic") ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          type="button"
          title="Italic"
        >
          <Italic size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive("underline")
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          type="button"
          title="Underline"
        >
          <UnderlineIcon size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Headings */}
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive("heading", { level: 1 })
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          type="button"
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive("heading", { level: 2 })
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          type="button"
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive("heading", { level: 3 })
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          type="button"
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive({ textAlign: "left" })
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          type="button"
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive({ textAlign: "center" })
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          type="button"
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive({ textAlign: "right" })
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          type="button"
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive({ textAlign: "justify" })
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          type="button"
          title="Align Justify"
        >
          <AlignJustify size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive("bulletList")
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          type="button"
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive("orderedList")
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          type="button"
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Quote */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive("blockquote")
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          type="button"
          title="Blockquote"
        >
          <Quote size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Media & Links */}
        <button
          onClick={setLink}
          className={`px-3 py-1 rounded text-sm ${
            editor.isActive("link") ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          type="button"
          title="Link"
        >
          <LinkIcon size={16} />
        </button>
        <button
          onClick={addImage}
          className="px-3 py-1 rounded text-sm bg-gray-200"
          type="button"
          title="Image"
        >
          <ImageIcon size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Table */}
        <button
          onClick={insertTable}
          className="px-3 py-1 rounded text-sm bg-gray-200"
          type="button"
          title="Insert Table"
        >
          <TableIcon size={16} />
        </button>

        {/* Table Controls (shown when cursor is in table) */}
        {editor.isActive("table") && (
          <>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <button
              onClick={addColumn}
              className="px-3 py-1 rounded text-sm bg-gray-200"
              type="button"
              title="Add Column"
            >
              +Col
            </button>
            <button
              onClick={deleteColumn}
              className="px-3 py-1 rounded text-sm bg-gray-200"
              type="button"
              title="Delete Column"
            >
              -Col
            </button>
            <button
              onClick={addRow}
              className="px-3 py-1 rounded text-sm bg-gray-200"
              type="button"
              title="Add Row"
            >
              +Row
            </button>
            <button
              onClick={deleteRow}
              className="px-3 py-1 rounded text-sm bg-gray-200"
              type="button"
              title="Delete Row"
            >
              -Row
            </button>
            <button
              onClick={deleteTable}
              className="px-3 py-1 rounded text-sm bg-gray-200"
              type="button"
              title="Delete Table"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={toggleHeaderColumn}
              className="px-3 py-1 rounded text-sm bg-gray-200"
              type="button"
              title="Toggle Header Column"
            >
              HCol
            </button>
            <button
              onClick={toggleHeaderRow}
              className="px-3 py-1 rounded text-sm bg-gray-200"
              type="button"
              title="Toggle Header Row"
            >
              HRow
            </button>
            <button
              onClick={toggleHeaderCell}
              className="px-3 py-1 rounded text-sm bg-gray-200"
              type="button"
              title="Toggle Header Cell"
            >
              HCell
            </button>
          </>
        )}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Export */}
        {onExportPDF && (
          <button
            onClick={onExportPDF}
            className="px-3 py-1 rounded text-sm bg-green-500 text-white hover:bg-green-600"
            type="button"
            title="Export to PDF"
          >
            <Download size={16} />
          </button>
        )}
      </div>

      {/* Page Navigation */}
      <div className="border-b p-2 flex items-center justify-between bg-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Pages:</span>
          <div className="flex gap-1">
            {pages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => switchPage(index)}
                className={`px-3 py-1 rounded text-sm ${
                  index === currentPageIndex
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                type="button"
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={addNewPage}
            className="px-2 py-1 rounded text-sm bg-green-500 text-white hover:bg-green-600"
            type="button"
            title="Add New Page"
          >
            <Plus size={16} />
          </button>
          {pages.length > 1 && (
            <button
              onClick={deleteCurrentPage}
              className="px-2 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600"
              type="button"
              title="Delete Current Page"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <div className="text-sm text-gray-600">
          Page {currentPageIndex + 1} of {pages.length}
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 p-4 overflow-auto bg-white">
        <div className="max-w-4xl mx-auto min-h-[800px] border border-gray-300 rounded shadow-sm p-6 bg-white">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
