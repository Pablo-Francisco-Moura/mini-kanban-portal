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
import { deleteCardApi } from "../api/cards";
import { useKanbanStore } from "../store/kanbanStore";
import type { TypeCard } from "../types/kanban";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  card: TypeCard;
}

export function Card({ card }: Props) {
  const setColumns = useKanbanStore((s) => s.setColumns);
  const columns = useKanbanStore((s) => s.columns);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await deleteCardApi(card.id);
    const newColumns = columns.map((col) =>
      col.id === card.columnId
        ? { ...col, cards: col.cards.filter((c) => c.id !== card.id) }
        : col
    );
    setColumns(newColumns);
    setLoading(false);
    setOpen(false);
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
        <Tooltip title="Deletar Cartão">
          <IconButton
            size="small"
            style={{ float: "right" }}
            onClick={() => setOpen(true)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja deletar este cartão?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" disabled={loading}>
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
