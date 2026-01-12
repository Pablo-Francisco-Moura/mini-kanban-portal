import { Card } from "./Card";
import { useState } from "react";
import { DialogBox } from "./DialogBox";
import { moveCardApi } from "../api/cards";
import { useKanbanStore } from "../store/kanbanStore";
import { createColumnApi } from "../api/columns";
import { Tooltip, IconButton } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import type { DropResult } from "react-beautiful-dnd";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  boardId: string;
}

export function KanbanDnd({ boardId }: Props) {
  const columns = useKanbanStore((s) => s.columns);
  const setColumns = useKanbanStore((s) => s.setColumns);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  const createColumn = async () => {
    setLoading(true);
    try {
      const res = await createColumnApi(boardId, {
        name: newColumnName,
        order: columns.length + 1,
      });

      if (res?.data) {
        setColumns([...columns, res.data]);
        setNewColumnName("");
        setOpen(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Find source and destination columns.
    const sourceColIdx = columns.findIndex(
      (col) => col.id === source.droppableId
    );
    const destColIdx = columns.findIndex(
      (col) => col.id === destination.droppableId
    );
    if (sourceColIdx === -1 || destColIdx === -1) return;

    const sourceCol = columns[sourceColIdx];
    const destCol = columns[destColIdx];
    const card = sourceCol.cards[source.index];

    // Remove card from source.
    const newSourceCards = Array.from(sourceCol.cards);
    newSourceCards.splice(source.index, 1);

    // Add card to destination.
    const newDestCards = Array.from(destCol.cards);
    newDestCards.splice(destination.index, 0, card);

    const newColumns = [...columns];
    newColumns[sourceColIdx] = { ...sourceCol, cards: newSourceCards };
    newColumns[destColIdx] = { ...destCol, cards: newDestCards };
    setColumns(newColumns);

    // Save change to backend if moved to different column.
    if (card.id && destination.droppableId !== source.droppableId) {
      moveCardApi(card.id, destination.droppableId);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{
          gap: 16,
          flex: 1,
          display: "flex",
          overflowX: "auto",
          flexDirection: "row",
        }}
      >
        {columns.map((column) => (
          <Droppable droppableId={column.id} key={column.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  padding: 12,
                  minWidth: 250,
                  background: "#f4f4f4",
                  borderRadius: 8,
                }}
              >
                <h3>{column.name}</h3>
                <div
                  style={{
                    gap: 8,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {column?.cards?.map((card, idx) => (
                    <Draggable draggableId={card.id} index={idx} key={card.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Card card={card} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
        <Tooltip arrow title="Adicionar Coluna">
          <IconButton onClick={() => setOpen(true)}>
            <AddIcon />
          </IconButton>
        </Tooltip>

        <DialogBox
          open={open}
          label="Coluna"
          action={createColumn}
          loading={loading}
          newName={newColumnName}
          onClose={() => setOpen(false)}
          setNewName={setNewColumnName}
        />
      </div>
    </DragDropContext>
  );
}
