export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  imageUrl?: string;
  difficulty?: "easy" | "medium" | "hard";
};