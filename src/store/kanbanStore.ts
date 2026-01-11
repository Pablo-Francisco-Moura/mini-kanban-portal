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
  boardId: string;
  cardIds: string[];
};

export type TypeBoard = {
  id: string;
  name: string;
  columnIds: string[];
};

interface IKanbanState {
  cards: TypeCard[];
  boards: TypeBoard[];
  columns: TypeColumn[];

  addCard: (card: TypeCard) => void;
  setCards: (cards: TypeCard[]) => void;
  addBoard: (board: TypeBoard) => void;
  moveCard: (cardId: string, newColumnId: string) => void;
  setBoards: (boards: TypeBoard[]) => void;
  addColumn: (column: TypeColumn) => void;
  setColumns: (columns: TypeColumn[]) => void;
  updateCard: (card: TypeCard) => void;
  deleteCard: (cardId: string) => void;
}

export const useKanbanStore = create<IKanbanState>((set) => ({
  cards: [],
  boards: [],
  columns: [],

  addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),

  setCards: (cards) => set({ cards }),

  addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),

  moveCard: (cardId, newColumnId) =>
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === cardId ? { ...c, columnId: newColumnId } : c
      ),
    })),

  setBoards: (boards) => set({ boards }),

  addColumn: (column) =>
    set((state) => ({ columns: [...state.columns, column] })),

  setColumns: (columns) => set({ columns }),

  updateCard: (card) =>
    set((state) => ({
      cards: state.cards.map((c) => (c.id === card.id ? card : c)),
    })),

  deleteCard: (cardId) =>
    set((state) => ({
      cards: state.cards.filter((c) => c.id !== cardId),
    })),
}));
