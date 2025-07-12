export type User = {
  id: number;
  email: string;
  username: string;
  birthdate: string | null;
  createdAt: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  description: string | null;
  password: string;
  role: string[];
};
