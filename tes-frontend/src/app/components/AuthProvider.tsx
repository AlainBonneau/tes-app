"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { restoreSession } from "../features/auth/authSlice";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return <>{children}</>;
}
