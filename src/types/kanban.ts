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

export type TypeBoardDetailResponse = TypeBoard & {
  cards: TypeCard[];
  columns: TypeColumn[];
};

export type TypeFieldsValues = Record<string, string>;

export type TypeMode = "light" | "dark";
