import {
  Dialog,
  Button,
  Tooltip,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useState } from "react";
import { DialogBox } from "./DialogBox";
import { useTranslation } from "react-i18next";
import { useKanbanStore } from "../store/kanbanStore";
import { deleteCardApi, updateCardApi } from "../api/cards";
import type { TypeCard, TypeFieldsValues } from "../types/kanban";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  card: TypeCard;
}

export function Card({ card }: Props) {
  const { t } = useTranslation();

  const setColumns = useKanbanStore((s) => s.setColumns);
  const columns = useKanbanStore((s) => s.columns);

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [editValues, setEditValues] = useState<TypeFieldsValues>({
    title: card.title,
    description: card.description || "",
  });

  const handleDelete = async () => {
    setLoadingDelete(true);
    await deleteCardApi(card.id);
    const newColumns = columns.map((col) =>
      col.id === card.columnId
        ? { ...col, cards: col.cards.filter((c) => c.id !== card.id) }
        : col
    );
    setColumns(newColumns);
    setLoadingDelete(false);
    setOpenDelete(false);
  };

  const handleEdit = async () => {
    setLoadingEdit(true);
    const { title, description } = editValues;
    await updateCardApi(card.id, { title, description });
    // Atualiza o card no estado local
    const newColumns = columns.map((col) =>
      col.id === card.columnId
        ? {
            ...col,
            cards: col.cards.map((c) =>
              c.id === card.id ? { ...c, title, description } : c
            ),
          }
        : col
    );
    setColumns(newColumns);
    setLoadingEdit(false);
    setOpenEdit(false);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          padding: 10,
          boxShadow: "0 1px 4px #0001",
          background: "#fff",
          borderRadius: 6,
          justifyContent: "space-between",
        }}
      >
        <div>
          <strong>{card.title}</strong>

          {card.description && (
            <p style={{ margin: "6px 0 0 0", fontSize: 14 }}>
              {card.description}
            </p>
          )}
        </div>
        <div
          style={{
            display: "flex",
          }}
        >
          <Tooltip title={`${t("update")} ${t("card")}`}>
            <IconButton
              size="small"
              style={{ float: "right" }}
              onClick={() => setOpenEdit(true)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("delete_card") as string}>
            <IconButton
              size="small"
              style={{ float: "right" }}
              onClick={() => setOpenDelete(true)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <DialogBox
        open={openEdit}
        label={`${t("update")} ${t("card")}`}
        fields={["title", "description"]}
        loading={loadingEdit}
        newValues={editValues}
        setNew={setEditValues}
        action={handleEdit}
        onClose={() => setOpenEdit(false)}
      />
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>{t("confirm_delete_title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("confirm_delete_text")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} disabled={loadingDelete}>
            {t("cancel")}
          </Button>
          <Button onClick={handleDelete} color="error" disabled={loadingDelete}>
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
