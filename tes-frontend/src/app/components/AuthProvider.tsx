"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setHydrated } from "../features/auth/authSlice";
import type { AuthUser } from "../features/auth/authSlice";
import { useServices } from "../context/ServicesContext";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const { userService } = useServices();

  useEffect(() => {
    userService
      .getMe<AuthUser>()
      .then((user) => dispatch(setUser(user)))
      .catch(() => dispatch(setUser(null)))
      .finally(() => dispatch(setHydrated()));
  }, [dispatch, userService]);

  return <>{children}</>;
}
