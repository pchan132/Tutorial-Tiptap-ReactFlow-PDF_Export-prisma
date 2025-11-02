"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Download, Loader2 } from "lucide-react";
import DocumentEditor from "@/components/DocumentEditor";
import { exportDocumentToPDF } from "@/lib/pdfExport";

import "../../../globals.css";

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

export default function EditDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;
  const isNewDocument = documentId === "new";

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [exporting, setExporting] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isNewDocument) {
      fetchDocument();
    } else {
      // Create a new empty document
      setDocument({
        id: "",
        title: "Untitled Document",
        pages: [{ id: "1", content: { type: "doc", content: [] } }],
        metadata: {},
      });
      setLoading(false);
    }
  }, [documentId, isNewDocument]);

  useEffect(() => {
    // Auto-save functionality
    if (document) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        saveDocument(false); // Silent save without showing loading state
      }, 3000); // Auto-save after 3 seconds of inactivity
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [document]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/documents/${documentId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }

      const data = await response.json();

      // Convert the single content to pages structure if needed
      if (data.content && !data.pages) {
        data.pages = [{ id: "1", content: data.content }];
      }

      setDocument(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const saveDocument = async (showSavingState = true) => {
    if (!document) return;

    try {
      if (showSavingState) {
        setSaving(true);
      }

      const payload = {
        title: document.title,
        content: document.pages[0]?.content || { type: "doc", content: [] },
        pageCount: document.pages.length,
        metadata: document.metadata,
      };

      const url = isNewDocument
        ? "/api/documents"
        : `/api/documents/${documentId}`;

      const method = isNewDocument ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save document");
      }

      const savedDocument = await response.json();

      if (isNewDocument) {
        // Redirect to the edit page with the new document ID
        router.replace(`/documents/${savedDocument.id}/edit`);
      } else {
        setDocument((prev) =>
          prev ? { ...prev, id: savedDocument.id } : null
        );
      }

      setLastSaved(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      if (showSavingState) {
        setSaving(false);
      }
    }
  };

  const handleDocumentChange = (updatedDocument: Document) => {
    setDocument(updatedDocument);
  };

  const handleExportPDF = async () => {
    if (!document || !editorRef.current) return;

    try {
      setExporting(true);

      // Find the editor content element
      const editorContentElement =
        editorRef.current.querySelector(".ProseMirror");
      if (!editorContentElement) {
        throw new Error("Editor content not found");
      }

      await exportDocumentToPDF(document, editorContentElement as HTMLElement);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading document...</span>
        </div>
      </div>
    );
  }

  if (error && !document) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Link
          href="/documents"
          className="mt-4 inline-block text-blue-500 hover:underline"
        >
          ← Back to Documents
        </Link>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Document not found
          </h2>
          <Link href="/documents" className="text-blue-500 hover:underline">
            ← Back to Documents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/documents"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium text-gray-800">
              {isNewDocument ? "New Document" : "Edit Document"}
            </h1>
            {lastSaved && (
              <span className="text-sm text-gray-500">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-1 rounded text-sm mr-2">
              {error}
            </div>
          )}

          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            {exporting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Download size={16} />
            )}
            {exporting ? "Exporting..." : "Export PDF"}
          </button>

          <button
            onClick={() => saveDocument(true)}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden" ref={editorRef}>
        <DocumentEditor
          document={document}
          onChange={handleDocumentChange}
          onExportPDF={handleExportPDF}
        />
      </div>
    </div>
  );
}
