export type TypeCard = {
  id: number;
  title: string;
  columnId: number;
  description?: string;
};

export type TypeColumn = {
  id: number;
  name: string;
  cards: TypeCard[];
  boardId: number;
  cardIds: number[];
  colorId?: number | null;
};

export type TypeColumnColor = {
  id: number;
  name: string;
  hex: string;
};

export type TypeBoard = {
  id: number;
  name: string;
  columnIds: number[];
};

export type TypeBoardDetailResponse = TypeBoard & {
  cards: TypeCard[];
  columns: TypeColumn[];
};

export type TypeFieldsValues = Record<string, string>;

export type TypeMode = "light" | "dark";
