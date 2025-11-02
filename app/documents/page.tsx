"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, FileText, Calendar } from "lucide-react";

interface Document {
  id: string;
  title: string;
  pageCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/documents");
      
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      
      const data = await response.json();
      setDocuments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      // Remove the deleted document from the list
      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Documents</h1>
        <Link
          href="/documents/new/edit"
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          New Document
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading documents...</div>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No documents yet</h2>
          <p className="text-gray-500 mb-6">Create your first document to get started</p>
          <Link
            href="/documents/new/edit"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
            Create Document
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document) => (
            <div
              key={document.id}
              className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate flex-1">
                  {document.title}
                </h3>
                <div className="flex gap-2 ml-2">
                  <Link
                    href={`/documents/${document.id}/edit`}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => deleteDocument(document.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  <span>{document.pageCount} page{document.pageCount !== 1 ? 's' : ''}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Updated: {formatDate(document.updatedAt)}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Link
                  href={`/documents/${document.id}/edit`}
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  Open Document →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}