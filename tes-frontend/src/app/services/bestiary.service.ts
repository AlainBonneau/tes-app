import api from "@/app/api/axiosConfig";
import type { Creature } from "@/app/types/creatures";

export type UpsertCreaturePayload = {
  name: string;
  type: string;
  description: string;
  regionId?: number | null;
  imageUrl?: string;
};

export const bestiaryService = {
  async listCreatures<T = Creature[]>(): Promise<T> {
    const { data } = await api.get<T>("/creatures");
    return data;
  },

  async getCreatureById<T = Creature>(id: number | string): Promise<T> {
    const { data } = await api.get<T>(`/creatures/${id}`);
    return data;
  },

  async createCreature<T = Creature>(
    payload: UpsertCreaturePayload,
  ): Promise<T> {
    const { data } = await api.post<T>("/creatures", payload);
    return data;
  },

  async updateCreature<T = Creature>(
    creatureId: number,
    payload: unknown,
  ): Promise<T> {
    const { data } = await api.patch<T>(`/creatures/${creatureId}`, payload);
    return data;
  },

  async deleteCreature(creatureId: number): Promise<void> {
    await api.delete(`/creatures/${creatureId}`);
  },
};

