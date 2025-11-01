"use client";
import React from "react";
import { useEffect, useState } from "react";

interface TypeNote {
  title: string;
  content: any; // tiptap ส่ง JSON object กลับมา ใช้ any ไปก่อนก็ได้
}

export default async function page({ params }: { params: { id: string } }) {
  const [note, setNote] = React.useState<TypeNote>({
    title: "Untitled Note",
    content: {},
  });

  const id = params.id;
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    const fetchNote = async () => {
      const response = await fetch(`/api/notes/${id}`);
      const data = await response.json();
      setNote(data);
    };

    fetchNote();
  }, [params.id]);

  console.log("Note ID in page.tsx:", note);

  return <div>Note ID: {params.id}</div>;
}
