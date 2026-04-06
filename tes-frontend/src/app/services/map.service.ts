import api from "@/app/api/axiosConfig";
import type { Region } from "@/app/types/region";

export type UpsertRegionPayload = {
  name: string;
  description: string;
  x: number;
  y: number;
  imageUrl: string | null;
};

export const mapService = {
  async listRegions<T = Region[]>(): Promise<T> {
    const { data } = await api.get<T>("/regions");
    return data;
  },

  async createRegion<T = Region>(payload: UpsertRegionPayload): Promise<T> {
    const { data } = await api.post<T>("/regions", payload);
    return data;
  },

  async updateRegion<T = Region>(
    regionId: number,
    payload: unknown,
  ): Promise<T> {
    const { data } = await api.patch<T>(`/regions/${regionId}`, payload);
    return data;
  },

  async deleteRegion(regionId: number): Promise<void> {
    await api.delete(`/regions/${regionId}`);
  },
};

