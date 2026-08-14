import { t } from "i18next";
import { Card } from "./Card";
import { DialogBox } from "./DialogBox";
import { moveCardApi } from "../api/cards";
import { createCardApi } from "../api/cards";
import { useKanbanStore } from "../store/kanbanStore";
import { useState, useEffect } from "react";
import { Tooltip, IconButton } from "@mui/material";
import { createColumnApi, updateColumnApi } from "../api/columns";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getColumnColorsApi, createColumnColorApi } from "../api/colors";
import type { DropResult } from "react-beautiful-dnd";
import type { TypeFieldsValues, TypeColumnColor } from "../types/kanban";
import AddIcon from "@mui/icons-material/Add";
import PaletteIcon from "@mui/icons-material/Palette";

interface Props {
  boardId: number;
}

export function DragAndDrop({ boardId }: Props) {
  const mode = useKanbanStore((s) => s.mode);
  const columns = useKanbanStore((s) => s.columns);
  const setColumns = useKanbanStore((s) => s.setColumns);

  const [columnId, setColumnId] = useState<number | null>(null);
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
    colorId: "",
  });
  const [columnError, setColumnError] = useState<string | null>(null);

  const [columnColors, setColumnColors] = useState<TypeColumnColor[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editColumnId, setEditColumnId] = useState<number | null>(null);
  const [editColumnValues, setEditColumnValues] = useState<TypeFieldsValues>({
    name: "",
    colorId: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [newColorValues, setNewColorValues] = useState<TypeFieldsValues>({
    name: "",
    hex: "",
  });
  const [creatingColor, setCreatingColor] = useState(false);
  const [colorError, setColorError] = useState<string | null>(null);

  const fetchColumnColors = async () => {
    try {
      const res = await getColumnColorsApi();
      const backendColors =
        res?.data && Array.isArray(res.data) ? res.data : [];
      // merge with local colors saved in localStorage (fallback when backend doesn't support POST)
      const localRaw = localStorage.getItem("local_column_colors");
      const localColors: TypeColumnColor[] = localRaw
        ? JSON.parse(localRaw)
        : [];
      // assign negative ids for local colors if necessary
      const merged = [...backendColors, ...localColors];
      setColumnColors(merged);
    } catch (err: any) {
      // try to load local colors only
      const localRaw = localStorage.getItem("local_column_colors");
      const localColors: TypeColumnColor[] = localRaw
        ? JSON.parse(localRaw)
        : [];
      setColumnColors(localColors);
    }
  };

  useEffect(() => {
    let mounted = true;
    // call fetch but ignore mounted check inside since setState is safe here
    fetchColumnColors();
    return () => {
      mounted = false;
    };
  }, []);

  const createColumn = async () => {
    setLoadingColumn(true);
    try {
      const res = await createColumnApi(boardId, {
        name: newColumnValues.name,
        order: columns.length + 1,
        colorId: newColumnValues.colorId || null,
      });

      if (res?.data) {
        // Certify that cards array exists.
        const newCol = { ...res.data, cards: res.data.cards || [] };
        setColumns([...columns, newCol]);
        setNewColumnValues({ name: "", colorId: "" });
        setOpenColumn(false);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Erro interno";
      setColumnError(msg);
      return;
    } finally {
      setLoadingColumn(false);
    }
  };

  const createCard = async () => {
    setLoadingCard(true);
    try {
      const res = await createCardApi(columnId as number, {
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
      (col) => col.id === Number(source.droppableId),
    );
    const destColIdx = columns.findIndex(
      (col) => col.id === Number(destination.droppableId),
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
      moveCardApi(card.id, Number(destination.droppableId));
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
          <Droppable droppableId={String(column.id)} key={column.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  padding: 12,
                  minWidth: 250,
                  overflowY: "auto",
                  borderRadius: 8,
                  backgroundColor:
                    // use column-specific color from backend when available
                    (column?.columnColorId
                      ? columnColors.find(
                          (c) => c.id === Number(column.columnColorId),
                        )?.hex
                      : column?.colorId
                        ? columnColors.find(
                            (c) => c.id === Number(column.colorId),
                          )?.hex
                        : null) || (mode === "light" ? "#f4f4f4" : "#484555ff"),
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
                      sx={{
                        maxHeight: "40px",
                      }}
                      onClick={() => {
                        setOpenCard(true);
                        setColumnId(column.id);
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip arrow title={t("edit")}>
                    <IconButton
                      sx={{ maxHeight: "40px" }}
                      onClick={async () => {
                        // ensure colors are loaded before opening
                        if (!columnColors || columnColors.length === 0) {
                          await fetchColumnColors();
                        }
                        // open edit modal with column data
                        setEditColumnId(column.id);
                        setEditColumnValues({
                          name: column.name || "",
                          colorId:
                            column.columnColorId != null
                              ? String(column.columnColorId)
                              : column.colorId != null
                                ? String(column.colorId)
                                : "",
                        });
                        setEditError(null);
                        setEditOpen(true);
                      }}
                    >
                      {/* pencil icon */}
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"
                          fill="currentColor"
                        />
                      </svg>
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
                    <Draggable
                      draggableId={String(card.id)}
                      index={idx}
                      key={card.id}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Card mode={mode} card={card} />
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
        <Tooltip arrow title={t("manage_colors") || "Colors"}>
          <IconButton
            sx={{ top: "10px", maxHeight: "40px", ml: 1 }}
            onClick={async () => {
              await fetchColumnColors();
              setColorModalOpen(true);
            }}
          >
            <PaletteIcon />
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
          colors={columnColors}
          errorMessage={columnError}
        />
        <DialogBox
          open={colorModalOpen}
          label={t("new") + " " + t("color")}
          fields={["name", "hex"]}
          action={async () => {
            setCreatingColor(true);
            try {
              const res = await createColumnColorApi({
                name: newColorValues.name,
                hex: newColorValues.hex,
              });
              if (res?.data) {
                await fetchColumnColors();
                setNewColorValues({ name: "", hex: "" });
                setColorModalOpen(false);
              }
            } catch (err: any) {
              const status = err?.response?.status;
              if (status === 404) {
                // backend doesn't support creating colors; save locally as fallback
                try {
                  const localRaw = localStorage.getItem("local_column_colors");
                  const localColors: TypeColumnColor[] = localRaw
                    ? JSON.parse(localRaw)
                    : [];
                  const next: TypeColumnColor = {
                    id: -Date.now(),
                    name: newColorValues.name,
                    hex: newColorValues.hex,
                  };
                  localColors.push(next);
                  localStorage.setItem(
                    "local_column_colors",
                    JSON.stringify(localColors),
                  );
                  await fetchColumnColors();
                  setNewColorValues({ name: "", hex: "" });
                  setColorModalOpen(false);
                } catch (e) {
                  setColorError("Erro ao salvar cor localmente");
                }
              } else {
                setColorError(
                  err?.response?.data?.message ||
                    err?.message ||
                    "Erro ao criar cor",
                );
              }
            } finally {
              setCreatingColor(false);
            }
          }}
          setNew={setNewColorValues}
          onClose={() => setColorModalOpen(false)}
          loading={creatingColor}
          newValues={newColorValues}
          errorMessage={colorError}
        />
        <DialogBox
          open={editOpen}
          label={`${t("edit")} ${t("column")}`}
          fields={["name"]}
          action={async () => {
            if (!editColumnId) return;
            setEditLoading(true);
            try {
              const res = await updateColumnApi(editColumnId, {
                name: editColumnValues.name,
                colorId: editColumnValues.colorId || null,
              });
              if (res?.data) {
                // replace column in store while preserving cards
                const updated = res.data;
                const updatedColumns = columns.map((c) =>
                  c.id === updated.id
                    ? {
                        ...c,
                        ...updated,
                        cards: c.cards || updated.cards || [],
                      }
                    : c,
                );
                setColumns(updatedColumns);
                setEditOpen(false);
              }
            } catch (err: any) {
              setEditError(
                err?.response?.data?.message || err?.message || "Erro interno",
              );
            } finally {
              setEditLoading(false);
            }
          }}
          setNew={setEditColumnValues}
          onClose={() => setEditOpen(false)}
          loading={editLoading}
          newValues={editColumnValues}
          colors={columnColors}
          errorMessage={editError}
          actionLabel={t("save")}
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
