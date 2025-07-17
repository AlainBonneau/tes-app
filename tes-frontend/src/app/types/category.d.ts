export type Category = {
  id: string;
  name: string;
  desc: string;
  icon: string;
  topics: number;
  lastPost: { author: string; date: string };
  slug?: string;
};
