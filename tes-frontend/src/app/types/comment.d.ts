export type Comment = {
    id: number;
    content: string;
    authorId: number;
    postId: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    author?: {
        id: number;
        username: string;
        avatarUrl?: string;
    };
}