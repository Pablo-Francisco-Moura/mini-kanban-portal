import { create } from "zustand";

export type TypeCard = {
  id: string;
  title: string;
  columnId: string;
  description?: string;
};

export type TypeColumn = {
  id: string;
  name: string;
  cards: TypeCard[];
  boardId: string;
  cardIds: string[];
};

export type TypeBoard = {
  id: string;
  name: string;
  columnIds: string[];
};

interface IKanbanState {
  boards: TypeBoard[];
  columns: TypeColumn[];

  // addCard: (card: TypeCard) => void;
  addBoard: (board: TypeBoard) => void;
  // moveCard: (cardId: string, newColumnId: string) => void;
  setBoards: (boards: TypeBoard[]) => void;
  addColumn: (column: TypeColumn) => void;
  setColumns: (columns: TypeColumn[]) => void;
  // updateCard: (card: TypeCard) => void;
  // deleteCard: (cardId: string) => void;
}

export const useKanbanStore = create<IKanbanState>((set) => ({
  boards: [],
  columns: [],

  // addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),

  addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),

  // moveCard: (cardId, newColumnId) =>
  //   set((state) => ({
  //     cards: state.cards.map((c) =>
  //       c.id === cardId ? { ...c, columnId: newColumnId } : c
  //     ),
  //   })),

  setBoards: (boards) => set({ boards }),

  addColumn: (column) =>
    set((state) => ({ columns: [...state.columns, column] })),

  setColumns: (columns) => set({ columns }),

  // updateCard: (card) =>
  //   set((state) => ({
  //     cards: state.cards.map((c) => (c.id === card.id ? card : c)),
  //   })),

  // deleteCard: (cardId) =>
  //   set((state) => ({
  //     cards: state.cards.filter((c) => c.id !== cardId),
  //   })),
}));
