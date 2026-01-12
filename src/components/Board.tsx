import { KanbanDnd } from "./KanbanDnd";
import { useEffect } from "react";
import { getBoardApi } from "../api/boards";
import { useKanbanStore } from "../store/kanbanStore";
import type { TypeBoard, TypeColumn, TypeCard } from "../store/kanbanStore";

export type TypeBoardDetailResponse = TypeBoard & {
  cards: TypeCard[];
  columns: TypeColumn[];
};

interface Props {
  boardId: string;
}

export function Board({ boardId }: Props) {
  const boards = useKanbanStore((s) => s.boards);

  const setColumns = useKanbanStore((s) => s.setColumns);

  // Fetch board with nested columns and cards.
  useEffect(() => {
    getBoardApi(boardId).then((res) => {
      const data = res?.data as TypeBoardDetailResponse;

      if (data && data?.columns && data.columns?.length > 0) {
        setColumns(data.columns);
      } else {
        setColumns([]);
      }
    });
  }, [boardId, setColumns]);

  const board = boards.find((b) => b.id === boardId);
  if (!board) return <div>Quadro não encontrado.</div>;

  return <KanbanDnd boardId={boardId} />;
}
