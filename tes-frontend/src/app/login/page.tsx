"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/app/features/auth/authSlice";
import { RootState } from "@/app/store";

export default function LoginPage() {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Appel à ton API backend
    const res = await fetch("http://localhost:3001/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const { token, user } = await res.json();
      dispatch(login({ token, user }));
      // Optionnel : redirige vers l’accueil ou dashboard
      window.location.href = "/";
    } else {
      setError("Identifiants incorrects");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark">
      <form
        onSubmit={handleSubmit}
        className="bg-parchment p-8 rounded-lg shadow-lg flex flex-col gap-6 min-w-[300px] w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-dark">Connexion</h2>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="p-3 rounded border border-gold"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="p-3 rounded border border-gold"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-gold text-dark font-bold rounded py-3 px-6 hover:bg-gold/80 transition"
        >
          Se connecter
        </button>
      </form>
      {auth.isAuthenticated && (
        <p className="mt-4 text-gold">
          Connecté en tant que {auth.user?.username}
        </p>
      )}
    </div>
  );
}
