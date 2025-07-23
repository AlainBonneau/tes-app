// components/AvatarUploader.tsx
import React, { useRef, useState } from "react";
import api from "@/app/api/axiosConfig";

export default function AvatarUploader({
  onUploaded,
}: {
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Aucune image sélectionnée.");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.url) {
        onUploaded(res.data.url);
      } else {
        setError("Erreur lors de l’upload.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.response?.data?.error || "Erreur lors de l’upload.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleUpload} className="gap-2 mt-2">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="border rounded p-1 w-1/2 sm:w-3/4"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-gold text-blood px-4 py-2 rounded font-bold border border-blood shadow hover:bg-gold/90 transition cursor-pointer"
      >
        {loading ? "Envoi..." : "Uploader"}
      </button>
      {error && <span className="text-red-600 ml-2">{error}</span>}
    </form>
  );
}
