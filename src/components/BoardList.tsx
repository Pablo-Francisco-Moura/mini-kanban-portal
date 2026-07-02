import { t } from "i18next";
import { DialogBox } from "./DialogBox";
import { useKanbanStore } from "../store/kanbanStore";
import { Tooltip, IconButton, Box, CircularProgress, useTheme, Paper, Typography } from "@mui/material";
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

  const theme = useTheme();

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
      const start = Date.now();
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
        const elapsed = Date.now() - start;
        const minDisplay = 300; // prevent flicker by showing at least 300ms
        const remaining = Math.max(0, minDisplay - elapsed);
        if (mounted) setTimeout(() => mounted && setInitialLoading(false), remaining);
      }
    };

    fetchBoards();

    return () => {
      mounted = false;
    };
    // Run only on mount to show the initial loading overlay while first fetch runs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setBoards]);

  // overlay background adapts to theme to keep good contrast on light/dark
  const overlayBg = theme.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.7)";

  return (
    <>
      {initialLoading && (
        <div
          role="status"
          aria-busy="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: overlayBg,
            zIndex: 1400,
            pointerEvents: "auto",
            backdropFilter: "blur(6px)",
          }}
        >
          <Paper
            elevation={8}
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              padding: 3,
              borderRadius: 2,
              minWidth: 360,
              maxWidth: "80%",
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'}}>
              <CircularProgress color="primary" />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                {t("loading_db")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("please_wait")}
              </Typography>
            </Box>
          </Paper>
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
