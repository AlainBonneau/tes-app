"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setHydrated } from "../features/auth/authSlice";
import api from "../api/axiosConfig";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    api
      .get("/users/me", { withCredentials: true })
      .then((res) => dispatch(setUser(res.data)))
      .catch(() => dispatch(setUser(null)))
      .finally(() => dispatch(setHydrated()));
  }, [dispatch]);

  return <>{children}</>;
}
