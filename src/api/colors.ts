import { api } from "./config";
import type { TypeColumnColor } from "../types/kanban";

export const getColumnColorsApi = () =>
  api.get<TypeColumnColor[]>("/column-colors");

export const createColumnColorApi = (data: { name: string; hex: string }) =>
  api.post<TypeColumnColor>("/column-colors", {
    name: data.name,
    hex: data.hex,
  });
