"use client";

import { useState } from "react";
import api from "../api/axiosConfig";
import { useToast } from "../context/ToastContext";
import Loader from "../components/Loader";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/forget-password", { email });
      setMessage("Si un compte existe, un email a été envoyé.");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      showToast("Une erreur est survenue. Réessaye.");
      setMessage("Une erreur est survenue. Réessaye.");
    } finally {
      setLoading(false);
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
            Mot de passe oublié
          </h2>
          {message ? (
            <div className="mb-4 text-green-600">{message}</div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded px-3 py-2"
                required
              />
              <button
                type="submit"
                className="bg-gold text-dark px-4 py-2 rounded hover:bg-gold/80 cursor-pointer"
                disabled={loading}
              >
                {loading ? <Loader /> : "Envoyer le lien de réinitialisation"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
