import { api } from "./config";
import type { TypeBoard } from "../store/kanbanStore";

export const getBoardApi = (id: string) => api.get<TypeBoard>(`/boards/${id}`);

export const getBoardsApi = () => api.get<TypeBoard[]>("/boards");

export const createBoardApi = (data: { name: string }) =>
  api.post<TypeBoard>("/boards", data);
