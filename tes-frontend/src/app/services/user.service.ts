import api from "@/app/api/axiosConfig";

export type UpdateMePayload = {
  firstName: string;
  lastName: string;
  birthdate: string;
  imageUrl: string;
  description: string;
};

export const userService = {
  async getMe<T = unknown>(): Promise<T> {
    const { data } = await api.get<T>("/users/me");
    return data;
  },

  async updateMe<T = unknown>(payload: UpdateMePayload): Promise<T> {
    const { data } = await api.put<T>("/users/me", payload);
    return data;
  },

  async listUsers<T = unknown[]>(): Promise<T> {
    const { data } = await api.get<T>("/users");
    return data;
  },

  async updateUser<T = unknown>(
    userId: number,
    payload: unknown,
  ): Promise<T> {
    const { data } = await api.put<T>(`/users/${userId}`, payload);
    return data;
  },

  async deleteUserContent(userId: number): Promise<void> {
    await api.delete(`/users/${userId}/content`);
  },

  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/users/${userId}`);
  },

  async uploadAvatar<T = { url?: string }>(formData: FormData): Promise<T> {
    const { data } = await api.post<T>("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};

