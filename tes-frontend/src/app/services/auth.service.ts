import api from "@/app/api/axiosConfig";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  username: string;
  birthdate?: string;
  firstName?: string;
  lastName?: string;
  description?: string;
};

export type ResetPasswordPayload = {
  email: string;
  token: string;
  newPassword: string;
};

export const authService = {
  async login(payload: LoginPayload): Promise<void> {
    await api.post("/users/login", payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async register(payload: RegisterPayload): Promise<void> {
    await api.post("/users/register", payload, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post("/forget-password", { email });
  },

  async resetPassword<T = { message?: string }>(
    payload: ResetPasswordPayload,
  ): Promise<T> {
    const { data } = await api.post<T>("/reset-password", payload);
    return data;
  },

  async logout(): Promise<void> {
    await api.post("/users/logout", {});
  },
};

