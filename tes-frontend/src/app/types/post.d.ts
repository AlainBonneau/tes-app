export type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  categoryId: number;
  createdAt: string;
  comments: Comment[];
  author?: {
    id: number;
    username: string;
    imageUrl?: string;
  };
  category?: {
    id: number;
    name: string;
  };
  commentsCount?: number;
  _count?: {
    comments: number;
  };
  summary?: string;
  topics?: number;
  lastEdit?: string;
  locked?: boolean;
  pinned?: boolean;
  slug?: string;
  updatedAt?: string;
  views?: number;
};
