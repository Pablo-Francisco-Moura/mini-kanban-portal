import { api } from "./config";
import type { TypeColumnColor } from "../types/kanban";

export const getColumnColorsApi = () =>
  api.get<TypeColumnColor[]>("/column-colors");
