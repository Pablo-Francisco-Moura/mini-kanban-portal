import {
  Dialog,
  Button,
  Tooltip,
  TextField,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useKanbanStore } from "../store/kanbanStore";
import { useEffect, useState } from "react";
import { getBoards, createBoard } from "../api/boards";
import Select from "@mui/material/Select";
import AddIcon from "@mui/icons-material/Add";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

interface Props {
  onSelectBoard: (id: string) => void;
  selectedBoardId: string | null;
}

export function BoardList({ onSelectBoard, selectedBoardId }: Props) {
  const boards = useKanbanStore((s) => s.boards);
  const setBoards = useKanbanStore((s) => s.setBoards);

  const [open, setOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [loading, setLoading] = useState(false);

  const createNewBoard = async () => {
    setLoading(true);
    try {
      const res = await createBoard({ name: newBoardName });
      if (res?.data) {
        setBoards([...boards, res.data]);
        setNewBoardName("");
        setOpen(false);
        onSelectBoard(res?.data?.id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBoards().then((res) => {
      if (res?.data && Array.isArray(res.data)) {
        setBoards(res.data);
        if (selectedBoardId === null && res.data.length > 0) {
          onSelectBoard(res.data?.[0]?.id);
        }
      } else {
        setBoards([]);
      }
    });
  }, [setBoards]);

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="board-select-label">Quadro</InputLabel>
        <Select
          id="board-select"
          value={selectedBoardId || ""}
          label="Quadro"
          labelId="board-select-label"
          onChange={(e) => onSelectBoard(e.target.value)}
        >
          {boards.map((board) => (
            <MenuItem key={board.id} value={board.id}>
              {board.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Tooltip arrow title="Adicionar Quadro">
        <IconButton onClick={() => setOpen(true)}>
          <AddIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Novo Quadro</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome do Quadro"
            value={newBoardName}
            margin="dense"
            onChange={(e) => setNewBoardName(e.target.value)}
            disabled={loading}
            autoFocus
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={createNewBoard}
            disabled={!newBoardName.trim() || loading}
            variant="contained"
          >
            Criar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
