import { useEffect } from "react";
import { getBoards } from "../api/boards";
import { useKanbanStore } from "../store/kanbanStore";
import Select from "@mui/material/Select";
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
          labelId="board-select-label"
          id="board-select"
          value={selectedBoardId || ""}
          label="Quadro"
          onChange={(e) => onSelectBoard(e.target.value)}
        >
          {boards.map((board) => (
            <MenuItem key={board.id} value={board.id}>
              {board.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
