import { t } from "i18next";
import { DialogBox } from "./DialogBox";
import { useKanbanStore } from "../store/kanbanStore";
import { Tooltip, IconButton, Box, CircularProgress } from "@mui/material";
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
  const [initialLoading, setInitialLoading] = useState(true);
  const [newColumnValues, setNewColumnValues] = useState<TypeFieldsValues>({
    name: "",
  });

  const createNewBoard = async () => {
    setLoading(true);
    try {
      const res = await createBoardApi({ name: newColumnValues.name });
      if (res?.data) {
        setBoards([...boards, res.data]);
        setNewColumnValues({ name: "" });
        setOpen(false);
        onSelectBoard(res?.data?.id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchBoards = async () => {
      setInitialLoading(true);
      try {
        const res = await getBoardsApi();
        if (!mounted) return;

        if (res?.data && Array.isArray(res.data)) {
          setBoards(res.data);
          if (selectedBoardId === null && res.data.length > 0) {
            onSelectBoard(res.data?.[0]?.id);
          }
        } else {
          setBoards([]);
        }
      } catch (err) {
        // keep existing behavior on error
        setBoards([]);
      } finally {
        if (mounted) setInitialLoading(false);
      }
    };

    fetchBoards();

    return () => {
      mounted = false;
    };
    // Run only on mount to show the initial loading overlay while first fetch runs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setBoards]);

  return (
    <>
      {initialLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1400,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#fff" }}>
            <CircularProgress color="inherit" />
            <div style={{ marginTop: 12 }}>{t("loading_db")}</div>
          </Box>
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="board-select-label"> {t("board")}</InputLabel>
          <Select
            id="board-select"
            value={selectedBoardId || ""}
            label={t("board")}
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
        <Tooltip arrow title={t("add_board")}>
          <IconButton
            sx={{
              maxHeight: "40px",
            }}
            onClick={() => setOpen(true)}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>

        <DialogBox
          open={open}
          label={`${t("new")} ${t("board")}`}
          fields={["name"]}
          action={createNewBoard}
          setNew={setNewColumnValues}
          onClose={() => setOpen(false)}
          loading={loading}
          newValues={newColumnValues}
        />
      </div>
    </>
  );
}
