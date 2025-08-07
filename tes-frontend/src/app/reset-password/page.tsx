"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/app/api/axiosConfig";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/reset-password", {
        email,
        token,
        newPassword,
      });
      setMessage(res.data.message || "Mot de passe réinitialisé !");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err?.response?.data?.error || "Erreur lors de la réinitialisation."
      );
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gold">
      <div className="bg-blood h-[20vh] w-full flex items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
          Mot de passe oublié
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center w-full flex-1 py-6">
        <div className="bg-blood p-6 rounded-lg shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-gold">
            Réinitialiser le mot de passe
          </h2>
          {message ? (
            <div className="mb-4 text-green-600">{message}</div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border rounded px-3 py-2"
                required
              />
              <button
                type="submit"
                className="bg-gold text-dark px-4 py-2 rounded hover:bg-gold/80 cursor-pointer"
              >
                Réinitialiser
              </button>
            </form>
          )}
        </div>
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
}
