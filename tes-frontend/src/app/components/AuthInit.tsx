"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { restoreSession } from "@/app/features/auth/authSlice";

export function AuthInit({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return <>{children}</>;
}
