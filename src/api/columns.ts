import { api } from "./config";
import type { TypeColumn } from "../types/kanban";

export const createColumnApi = (
  boardId: string | number,
  data: { name: string; order: number; colorId?: string | number | null },
) => {
  const payload = {
    name: data.name,
    order: data.order,
    colorId: data.colorId != null ? Number(data.colorId) : null,
  } as { name: string; order: number; colorId?: number | null };

  return api.post<TypeColumn>(`/boards/${Number(boardId)}/columns`, payload);
};
