export type Category = {
  id: number;
  name: string;
  desc: string;
  icon: string;
  topics: number;
  lastPost: { author: string; date: string };
  slug?: string;
};
