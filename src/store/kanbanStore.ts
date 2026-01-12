import { create } from "zustand";
import type { TypeBoard, TypeColumn, TypeMode } from "../types/kanban";

interface IKanbanState {
  mode: TypeMode;
  boards: TypeBoard[];
  columns: TypeColumn[];
  setMode: (mode: TypeMode) => void;
  addBoard: (board: TypeBoard) => void;
  setBoards: (boards: TypeBoard[]) => void;
  addColumn: (column: TypeColumn) => void;
  setColumns: (columns: TypeColumn[]) => void;
}

export const useKanbanStore = create<IKanbanState>((set) => ({
  mode: (localStorage.getItem("theme_mode") as TypeMode) || "light",
  boards: [],
  columns: [],

  setMode: (mode) => {
    localStorage.setItem("theme_mode", mode);
    set({ mode });
  },
  addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
  setBoards: (boards) => set({ boards }),
  addColumn: (column) =>
    set((state) => ({ columns: [...state.columns, column] })),
  setColumns: (columns) => set({ columns }),
}));
