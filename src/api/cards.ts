import { api } from "./config";
import type { TypeCard } from "../store/kanbanStore";

export const moveCardApi = (cardId: string, newColumnId: string) =>
  api.patch(`/cards/${cardId}/move`, { newColumnId });

export const createCardApi = (
  columnId: string,
  data: { title: string; description?: string }
) => api.post<TypeCard>(`/columns/${columnId}/cards`, data);

export const updateCardApi = (
  cardId: string,
  data: { title?: string; description?: string }
) => api.put<TypeCard>(`/cards/${cardId}`, data);

export const deleteCardApi = (cardId: string) => api.delete(`/cards/${cardId}`);
