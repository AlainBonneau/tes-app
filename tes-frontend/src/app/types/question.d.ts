export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  imageUrl?: string;
  difficulty?: "easy" | "medium" | "hard";
};

export type QuizProps = {
  title?: string;
  questions?: Question[];
  perQuestionSeconds?: number;
  slug?: string;
};
