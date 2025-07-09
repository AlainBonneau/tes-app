export type JwtUserPayload = {
  id: number;
  email: string;
  username: string;
  birthdate?: Date;
  createdAt: Date;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  description?: string;
  password: string;
  role: string;
};
