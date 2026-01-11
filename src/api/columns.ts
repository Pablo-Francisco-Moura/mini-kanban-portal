import { api } from "./config";
import type { TypeColumn } from "../store/kanbanStore";

export const createColumnApi = (boardId: string, data: { name: string }) =>
  api.post<TypeColumn>(`/boards/${boardId}/columns`, data);
