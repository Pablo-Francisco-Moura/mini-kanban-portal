import { Card } from "./Card";
import { moveCardApi } from "../api/cards";
import { useKanbanStore } from "../store/kanbanStore";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import type { DropResult } from "react-beautiful-dnd";

export function KanbanDnd() {
  const columns = useKanbanStore((s) => s.columns);
  const setColumns = useKanbanStore((s) => s.setColumns);

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
      <div style={{ display: "flex", gap: 16, flex: 1 }}>
        {columns.map((column) => (
          <Droppable droppableId={column.id} key={column.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  minWidth: 250,
                  background: "#f4f4f4",
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <h3>{column.name}</h3>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {column.cards.map((card, idx) => (
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
      </div>
    </DragDropContext>
  );
}
