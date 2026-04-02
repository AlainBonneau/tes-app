"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/app/features/auth/authSlice";
import type { RootState } from "@/app/store";
import api from "../api/axiosConfig";
import AuthHeader from "./components/AuthHeader";
import AuthFormCard from "./components/AuthFormCard";

export default function LoginRegisterPage() {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
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
        },
      );

      const res = await api.get("/users/me", { withCredentials: true });
      dispatch(setUser(res.data));
      router.push("/");
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof err.response === "object" &&
        err.response !== null &&
        "data" in err.response &&
        typeof err.response.data === "object" &&
        err.response.data !== null &&
        "error" in err.response &&
        typeof err.response.error === "string"
      ) {
        setError(err.response.error);
      } else if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof err.response === "object" &&
        err.response !== null &&
        "data" in err.response &&
        typeof err.response.data === "object" &&
        err.response.data !== null &&
        "error" in err.response.data &&
        typeof err.response.data.error === "string"
      ) {
        setError(err.response.data.error);
      } else {
        setError("Identifiants incorrects");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
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
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      setIsLogin(true);
      setError("Inscription réussie ! Vous pouvez maintenant vous connecter.");
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof err.response === "object" &&
        err.response !== null &&
        "data" in err.response &&
        typeof err.response.data === "object" &&
        err.response.data !== null &&
        "error" in err.response.data &&
        typeof err.response.data.error === "string"
      ) {
        setError(err.response.data.error);
      } else {
        setError("Erreur lors de l'inscription");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push("/");
    }
  }, [auth.isAuthenticated, router]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gold">
      <AuthHeader title={isLogin ? "Connexion" : "Inscription"} />

      <div className="flex flex-col items-center justify-center w-full flex-1 py-6">
        <AuthFormCard
          isLogin={isLogin}
          loading={loading}
          error={error}
          router={router}
          setIsLogin={setIsLogin}
          setError={setError}
          loginForm={{
            email,
            password,
            setEmail,
            setPassword,
            onSubmit: handleLogin,
          }}
          registerForm={{
            regEmail,
            regPassword,
            regUsername,
            birthdate,
            firstName,
            lastName,
            description,
            setRegEmail,
            setRegPassword,
            setRegUsername,
            setBirthdate,
            setFirstName,
            setLastName,
            setDescription,
            onSubmit: handleRegister,
          }}
        />
      </div>
    </div>
  );
}
