import { t } from "i18next";
import { Card } from "./Card";
import { useState } from "react";
import { DialogBox } from "./DialogBox";
import { moveCardApi } from "../api/cards";
import { createCardApi } from "../api/cards";
import { useKanbanStore } from "../store/kanbanStore";
import { createColumnApi } from "../api/columns";
import { Tooltip, IconButton } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import type { DropResult } from "react-beautiful-dnd";
import type { TypeFieldsValues } from "../types/kanban";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  boardId: string;
}

export function DragAndDrop({ boardId }: Props) {
  const columns = useKanbanStore((s) => s.columns);
  const setColumns = useKanbanStore((s) => s.setColumns);

  const [columnId, setColumnId] = useState("");
  const [openCard, setOpenCard] = useState(false);
  const [openColumn, setOpenColumn] = useState(false);
  const [loadingCard, setLoadingCard] = useState(false);
  const [loadingColumn, setLoadingColumn] = useState(false);
  const [newCardValues, setNewCardValues] = useState<TypeFieldsValues>({
    title: "",
    description: "",
  });
  const [newColumnValues, setNewColumnValues] = useState<TypeFieldsValues>({
    name: "",
  });

  const createColumn = async () => {
    setLoadingColumn(true);
    try {
      const res = await createColumnApi(boardId, {
        name: newColumnValues.name,
        order: columns.length + 1,
      });

      if (res?.data) {
        setColumns([...columns, res.data]);
        setNewColumnValues({ name: "" });
        setOpenColumn(false);
      }
    } finally {
      setLoadingColumn(false);
    }
  };

  const createCard = async () => {
    setLoadingCard(true);
    try {
      const res = await createCardApi(columnId, {
        title: newCardValues.title || "",
        description: newCardValues.description || "",
      });

      if (res?.data) {
        const updatedColumns = columns.map((col) => {
          if (col.id === columnId) {
            return { ...col, cards: [...col.cards, res.data] };
          }
          return col;
        });
        setColumns(updatedColumns);
        setNewCardValues({ title: "", description: "" });
        setOpenCard(false);
      }
    } finally {
      setLoadingCard(false);
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
                  overflowY: "auto",
                  background: "#f4f4f4",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    justifyContent: "space-between",
                    display: "flex",
                  }}
                >
                  <h3>{column.name}</h3>
                  <Tooltip arrow title={t("add_card")}>
                    <IconButton
                      onClick={() => {
                        setOpenCard(true);
                        setColumnId(column.id);
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </div>
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
        <Tooltip arrow title={t("add_column")}>
          <IconButton
            sx={{
              top: "10px",
              maxHeight: "40px",
            }}
            onClick={() => setOpenColumn(true)}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>

        <DialogBox
          open={openColumn}
          label={`${t("new")} ${t("column")}`}
          fields={["name"]}
          action={createColumn}
          setNew={setNewColumnValues}
          onClose={() => setOpenColumn(false)}
          loading={loadingColumn}
          newValues={newColumnValues}
        />
      </div>
      <DialogBox
        open={openCard}
        label={`${t("new")} ${t("card")}`}
        fields={["title", "description"]}
        action={createCard}
        loading={loadingCard}
        newValues={newCardValues}
        onClose={() => setOpenCard(false)}
        setNew={setNewCardValues}
      />
    </DragDropContext>
  );
}
