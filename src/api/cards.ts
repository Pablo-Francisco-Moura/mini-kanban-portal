import { api } from "./config";
import type { TypeCard } from "../types/kanban";

export const moveCardApi = (cardId: number, newColumnId: number) =>
  api.patch(`/cards/${cardId}/move`, { newColumnId });

export const createCardApi = (
  columnId: number,
  data: { title: string; description?: string }
) => api.post<TypeCard>(`/columns/${columnId}/cards`, data);

export const updateCardApi = (
  cardId: number,
  data: { title?: string; description?: string }
) => api.put<TypeCard>(`/cards/${cardId}`, data);

export const deleteCardApi = (cardId: number) => api.delete(`/cards/${cardId}`);
