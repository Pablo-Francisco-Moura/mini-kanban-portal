import { api } from "./config";
import type { TypeCard } from "../store/kanbanStore";

export const moveCard = (cardId: string, newColumnId: string) =>
  api.patch(`/cards/${cardId}/move`, { newColumnId });

export const createCard = (
  columnId: string,
  data: { title: string; description?: string }
) => api.post<TypeCard>(`/columns/${columnId}/cards`, data);

export const updateCard = (
  cardId: string,
  data: { title?: string; description?: string }
) => api.put<TypeCard>(`/cards/${cardId}`, data);

export const deleteCard = (cardId: string) => api.delete(`/cards/${cardId}`);
