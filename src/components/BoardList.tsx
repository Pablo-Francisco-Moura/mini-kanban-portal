import { t } from "i18next";
import { DialogBox } from "./DialogBox";
import { LoadingState } from "./LoadingState";
import { useKanbanStore } from "../store/kanbanStore";
import {} from "../api/colors";
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
  onSelectBoard: (id: number) => void;
  selectedBoardId: number | null;
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

  const [countdownSeconds, setCountdownSeconds] = useState(120);
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;
    let countdownInterval: ReturnType<typeof setInterval> | undefined;

    const clearTimers = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = undefined;
      }
    };

    const clearAllTimers = () => {
      clearTimers();
      if (finishTimer) {
        clearTimeout(finishTimer);
        finishTimer = undefined;
      }
    };

    const finishLoading = (keepVisible = false) => {
      if (!mounted) return;
      clearTimers();
      setCountdownSeconds(0);
      setProgressPercent(100);

      if (finishTimer) {
        clearTimeout(finishTimer);
        finishTimer = undefined;
      }

      finishTimer = setTimeout(
        () => {
          if (!mounted) return;
          setInitialLoading(false);
        },
        keepVisible ? 4000 : 700,
      );
    };

    const startCountdown = () => {
      if (countdownInterval) return;

      countdownInterval = setInterval(() => {
        if (!mounted) return;

        setCountdownSeconds((prev) => {
          const next = prev > 0 ? prev - 1 : 0;
          if (next === 0) {
            clearTimers();
          }
          return next;
        });

        setProgressPercent((value) => {
          const next = Math.min(100, value + 100 / 120);
          if (next >= 100) {
            // ensure overlay is finished when progress reaches 100%
            finishLoading();
          }
          return next;
        });
      }, 1000);
    };

    const fetchBoards = async () => {
      setInitialLoading(true);
      setCountdownSeconds(120);
      setProgressPercent(0);
      setErrorMessage(null);

      startCountdown();

      timeoutId = setTimeout(() => {
        if (!mounted) return;
        setCountdownSeconds(0);
        setProgressPercent(100);
        setErrorMessage(t("server_timeout_error"));
        clearTimers();
      }, 120000);

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
        finishLoading();
      } catch (err) {
        if (!mounted) return;

        const msg =
          err?.response?.data?.message || err?.message || t("server_error");
        setErrorMessage(msg);
        finishLoading(true);
      } finally {
        clearTimers();
      }
    };

    fetchBoards();

    return () => {
      mounted = false;
      clearTimers();
    };
    // Run only on mount to show the initial loading overlay while first fetch runs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setBoards]);

  // Board list does not use colors anymore; column colors are managed per-column

  return (
    <>
      <LoadingState
        open={initialLoading}
        countdownSeconds={countdownSeconds}
        progressPercent={progressPercent}
        errorMessage={errorMessage ?? undefined}
      />

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
            value={selectedBoardId != null ? String(selectedBoardId) : ""}
            label={t("board")}
            labelId="board-select-label"
            onChange={(e) => onSelectBoard(Number(e.target.value))}
          >
            {boards.map((board) => (
              <MenuItem key={board.id} value={String(board.id)}>
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
