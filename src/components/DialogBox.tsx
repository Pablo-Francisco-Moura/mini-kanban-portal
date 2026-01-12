import { Dialog } from "@mui/material";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import { DialogTitle } from "@mui/material";
import { DialogContent } from "@mui/material";
import { DialogActions } from "@mui/material";

interface Props {
  open: boolean;
  label: string;
  newName: string;
  loading: boolean;
  action: () => Promise<void>;
  onClose: () => void;
  setNewName: (name: string) => void;
}

export function DialogBox({
  open,
  label,
  newName,
  loading,
  action,
  onClose,
  setNewName,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`Novo(a) ${label}`}</DialogTitle>
      <DialogContent>
        <TextField
          label={`Nome do(a) ${label}`}
          value={newName}
          margin="dense"
          onChange={(e) => setNewName(e.target.value)}
          disabled={loading}
          autoFocus
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={action}
          disabled={!newName.trim() || loading}
          variant="contained"
        >
          Criar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
