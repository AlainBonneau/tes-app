export type Book = {
  id: number;
  title: string;
  author?: string | null;
  summary: string;
  imageUrl?: string | null;
  content: string;
};
