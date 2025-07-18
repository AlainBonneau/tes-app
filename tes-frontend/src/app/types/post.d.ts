export type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  categoryId: number;
  createdAt: string;
  lastEdit?: string;
  locked?: boolean;
  pinned?: boolean;
  slug?: string;
  updatedAt?: string;
  views?: number;
};
