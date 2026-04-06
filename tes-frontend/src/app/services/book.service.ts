import api from "@/app/api/axiosConfig";
import type { Book } from "@/app/types/book";

export type UpsertBookPayload = {
  title: string;
  author?: string;
  summary?: string;
  imageUrl?: string;
  content: string;
};

export const bookService = {
  async listBooks<T = Book[]>(): Promise<T> {
    const { data } = await api.get<T>("/books");
    return data;
  },

  async getBookById<T = Book>(bookId: number): Promise<T> {
    const { data } = await api.get<T>(`/books/${bookId}`);
    return data;
  },

  async createBook<T = Book>(payload: UpsertBookPayload): Promise<T> {
    const { data } = await api.post<T>("/books", payload);
    return data;
  },

  async updateBook<T = Book>(bookId: number, payload: unknown): Promise<T> {
    const { data } = await api.patch<T>(`/books/${bookId}`, payload);
    return data;
  },

  async deleteBook(bookId: number): Promise<void> {
    await api.delete(`/books/${bookId}`);
  },
};

