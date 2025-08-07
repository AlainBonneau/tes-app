"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/app/features/auth/authSlice";
import { RootState } from "@/app/store";
import api from "../api/axiosConfig";

export default function LoginRegisterPage() {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register state
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post(
        "/users/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // Cookie httpOnly est posé, va chercher le user courant
      const res = await api.get("/users/me", { withCredentials: true });
      dispatch(setUser(res.data));
      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Identifiants incorrects");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post(
        "/users/register",
        {
          email: regEmail,
          password: regPassword,
          username: regUsername,
          birthdate: birthdate || undefined,
          firstName,
          lastName,
          description,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      setIsLogin(true);
      setError("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Erreur lors de l'inscription");
      }
    } finally {
      setLoading(false);
    }
  };

  // Si déjà connecté, redirige vers /
  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push("/");
    }
  }, [auth.isAuthenticated, router]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gold">
      <div className="bg-blood h-[20vh] w-full flex items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-uncial uppercase text-gold text-center">
          {isLogin ? "Connexion" : "Inscription"}
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center w-full flex-1 py-6">
        <div className="bg-blood w-full max-w-md p-8 rounded-2xl shadow-lg">
          {error && (
            <div className="mb-4 text-center text-red-500">{error}</div>
          )}
          {isLogin ? (
            <form className="flex flex-col gap-6" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                className="p-3 rounded border border-gold bg-white text-dark"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <input
                type="password"
                placeholder="Mot de passe"
                className="p-3 rounded border border-gold bg-white text-dark"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="submit"
                className="bg-gold text-blood font-cinzel font-bold rounded py-3 px-6 hover:bg-gold/80 transition disabled:opacity-60 cursor-pointer"
                disabled={loading}
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>
              <div className="flex justify-between text-xs text-parchment">
                <span
                  className="underline hover:text-gold cursor-pointer"
                  onClick={() => {
                    router.push("/forgot-password");
                  }}
                >
                  Mot de passe oublié ?
                </span>
                <span>
                  Pas de compte ?{" "}
                  <span
                    className="underline hover:text-gold cursor-pointer"
                    onClick={() => {
                      setIsLogin(false);
                      setError("");
                    }}
                  >
                    Inscrivez-vous
                  </span>
                </span>
              </div>
            </form>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={handleRegister}>
              <input
                type="email"
                placeholder="Email *"
                className="p-3 rounded border border-gold bg-white text-dark"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <input
                type="password"
                placeholder="Mot de passe *"
                className="p-3 rounded border border-gold bg-white text-dark"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <input
                type="text"
                placeholder="Pseudo *"
                className="p-3 rounded border border-gold bg-white text-dark"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
              />
              <input
                type="date"
                placeholder="Date de naissance"
                className="p-3 rounded border border-gold bg-white text-dark"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
              />
              <input
                type="text"
                placeholder="Prénom"
                className="p-3 rounded border border-gold bg-white text-dark"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Nom"
                className="p-3 rounded border border-gold bg-white text-dark"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <textarea
                placeholder="Description"
                className="p-3 rounded border border-gold bg-white text-dark"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button
                type="submit"
                className="bg-gold text-blood font-cinzel font-bold rounded py-3 px-6 hover:bg-gold/80 transition disabled:opacity-60 cursor-pointer"
                disabled={loading}
              >
                {loading ? "Inscription..." : "S'inscrire"}
              </button>
              <div className="flex justify-center text-xs text-parchment mt-2">
                <span>
                  Déjà un compte ?{" "}
                  <span
                    className="underline hover:text-gold cursor-pointer"
                    onClick={() => {
                      setIsLogin(true);
                      setError("");
                    }}
                  >
                    Se connecter
                  </span>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
