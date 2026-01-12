import { create } from "zustand";
import type { TypeBoard, TypeColumn } from "../types/kanban";

interface IKanbanState {
  boards: TypeBoard[];
  columns: TypeColumn[];

  addBoard: (board: TypeBoard) => void;
  setBoards: (boards: TypeBoard[]) => void;
  addColumn: (column: TypeColumn) => void;
  setColumns: (columns: TypeColumn[]) => void;
}

export const useKanbanStore = create<IKanbanState>((set) => ({
  boards: [],
  columns: [],

  addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),

  setBoards: (boards) => set({ boards }),

  addColumn: (column) =>
    set((state) => ({ columns: [...state.columns, column] })),

  setColumns: (columns) => set({ columns }),
}));
