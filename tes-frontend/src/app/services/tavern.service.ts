import api from "@/app/api/axiosConfig";
import type { Category } from "@/app/types/category";
import type { Comment } from "@/app/types/comment";
import type { Post } from "@/app/types/post";

export type ListPostsOptions = {
  categorySlug?: string;
  admin?: boolean;
};

export type CreatePostPayload = {
  title: string;
  content: string;
  categoryId?: number;
  slug?: string;
};

export type CreateCommentPayload = {
  content: string;
};

export const tavernService = {
  async listCategories<T = Category[]>(): Promise<T> {
    const { data } = await api.get<T>("/categories");
    return data;
  },

  async createCategory<T = Category>(payload: unknown): Promise<T> {
    const { data } = await api.post<T>("/categories", payload);
    return data;
  },

  async updateCategory<T = Category>(
    categoryId: number,
    payload: unknown,
  ): Promise<T> {
    const { data } = await api.patch<T>(`/categories/${categoryId}`, payload);
    return data;
  },

  async deleteCategory(categoryId: number): Promise<void> {
    await api.delete(`/categories/${categoryId}`);
  },

  async listPosts<T = Post[]>(options?: ListPostsOptions): Promise<T> {
    const params = new URLSearchParams();

    if (options?.categorySlug) {
      params.set("categorySlug", options.categorySlug);
    }

    if (options?.admin) {
      params.set("admin", "1");
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/posts?${queryString}` : "/posts";
    const { data } = await api.get<T>(endpoint);
    return data;
  },

  async getPostBySlug<T = Post>(slug: string): Promise<T> {
    const { data } = await api.get<T>(`/posts/slug/${slug}`);
    return data;
  },

  async createPost<T = Post>(payload: CreatePostPayload): Promise<T> {
    const { data } = await api.post<T>("/posts", payload);
    return data;
  },

  async updatePost<T = Post>(postId: number, payload: unknown): Promise<T> {
    const { data } = await api.patch<T>(`/posts/${postId}`, payload);
    return data;
  },

  async deletePost(postId: number): Promise<void> {
    await api.delete(`/posts/${postId}`);
  },

  async listPostComments<T = Comment[]>(postId: number): Promise<T> {
    const { data } = await api.get<T>(`/posts/${postId}/comments`);
    return data;
  },

  async createPostComment<T = Comment>(
    postId: number,
    payload: CreateCommentPayload,
  ): Promise<T> {
    const { data } = await api.post<T>(`/posts/${postId}/comments`, payload);
    return data;
  },

  async deleteComment(commentId: number): Promise<void> {
    await api.delete(`/comments/${commentId}`);
  },
};

