import { DialogBox } from "./DialogBox";
import { useKanbanStore } from "../store/kanbanStore";
import { Tooltip, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { getBoardsApi, createBoardApi } from "../api/boards";
import type { TypeFieldsValues } from "../types/kanban";
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
  const [loading, setLoading] = useState(false);
  const [newColumnValues, setNewColumnValues] = useState<TypeFieldsValues>({
    Nome: "",
  });

  const createNewBoard = async () => {
    setLoading(true);
    try {
      const res = await createBoardApi({ name: newColumnValues.Nome });
      if (res?.data) {
        setBoards([...boards, res.data]);
        setNewColumnValues({ Nome: "" });
        setOpen(false);
        onSelectBoard(res?.data?.id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBoardsApi().then((res) => {
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

      <DialogBox
        open={open}
        label="Quadro"
        fields={["Nome"]}
        action={createNewBoard}
        setNew={setNewColumnValues}
        onClose={() => setOpen(false)}
        loading={loading}
        newValues={newColumnValues}
      />
    </div>
  );
}
