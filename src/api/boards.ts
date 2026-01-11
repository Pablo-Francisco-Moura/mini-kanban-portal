import { api } from "./config";
import type { TypeBoard } from "../store/kanbanStore";

export const getBoard = (id: string) => api.get<TypeBoard>(`/boards/${id}`);

export const getBoards = () => api.get<TypeBoard[]>("/boards");

export const createBoard = (data: { name: string }) =>
  api.post<TypeBoard>("/boards", data);
