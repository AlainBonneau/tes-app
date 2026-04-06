import api from "@/app/api/axiosConfig";

type QuizListItem = {
  slug: string;
};

export const quizService = {
  async listQuizzes<T = QuizListItem[]>(): Promise<T> {
    const { data } = await api.get<T>("/quizzes");
    return data;
  },

  async getQuizBySlug<T = unknown>(slug: string): Promise<T> {
    const { data } = await api.get<T>(`/quizzes/${slug}`);
    return data;
  },
};

