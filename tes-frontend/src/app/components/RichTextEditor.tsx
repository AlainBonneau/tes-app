"use client";
import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Loader from "./Loader";

type RichTextEditorProps = {
  value: string;
  onChange: (v: string) => void;
};

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"], // Permet alignement sur p et heading
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  if (!mounted)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-2 bg-parchment border border-gold rounded px-2 py-1">
        {/* Bouton titre (heading niveau 2) */}
        <button
          type="button"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor?.isActive("heading", { level: 2 })
              ? "font-bold underline"
              : ""
          }
        >
          Titre
        </button>
        {/* Format */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={
            editor?.isActive("bold") ? "font-bold underline" : "font-bold"
          }
        >
          <b>B</b>
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive("italic") ? "italic underline" : "italic"}
        >
          <i>I</i>
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={
            editor?.isActive("underline") ? "underline font-bold" : "underline"
          }
        >
          <u>U</u>
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          className={
            editor?.isActive({ textAlign: "left" }) ? "font-bold underline" : ""
          }
        >
          <span title="Aligner à gauche">⬅️</span>
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          className={
            editor?.isActive({ textAlign: "center" })
              ? "font-bold underline"
              : ""
          }
        >
          <span title="Centrer">⬆️</span>
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          className={
            editor?.isActive({ textAlign: "right" })
              ? "font-bold underline"
              : ""
          }
        >
          <span title="Aligner à droite">➡️</span>
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
          className={
            editor?.isActive({ textAlign: "justify" })
              ? "font-bold underline"
              : ""
          }
        >
          <span title="Justifier">📝</span>
        </button>

        {/* Séparateur */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        >
          ―
        </button>
        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().undo().run()}
        >
          ↺
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().redo().run()}
        >
          ↻
        </button>
        {/* Nettoyer le format */}
        <button
          type="button"
          onClick={() =>
            editor?.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          🧹
        </button>
      </div>
      <div className="border rounded bg-parchment min-h-[120px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
