export interface Region {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface Creature {
  id: number;
  name: string;
  type: string;
  description: string;
  imageUrl?: string;
  regionId?: number;
  region?: Region | null;
}
