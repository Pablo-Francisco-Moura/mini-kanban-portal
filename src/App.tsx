import { Board } from "./components/Board";
import { useState } from "react";
import { BoardList } from "./components/BoardList";
import { ThemeSwitch } from "./components/ThemeSwitch";
import { useKanbanStore } from "./store/kanbanStore";
import { Divider, Typography, ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
  const mode = useKanbanStore((s) => s.mode);
  const setMode = useKanbanStore((s) => s.setMode);

  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

  const theme = createTheme({
    palette: {
      mode,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        style={{
          gap: "12px",
          width: "100vw",
          height: "100vh",
          display: "flex",
          padding: "12px",
          maxWidth: "100vw",
          maxHeight: "100vh",
          flexDirection: "column",
          backgroundColor: mode === "light" ? "#e0e0e0" : "#27252fff",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              variant: "h1",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Mini Kanban
          </Typography>
          <ThemeSwitch mode={mode} setMode={setMode} />
        </div>
        <Divider sx={{ borderBottomWidth: "2px" }} />

        <BoardList
          onSelectBoard={setSelectedBoardId}
          selectedBoardId={selectedBoardId}
        />

        <Divider sx={{ borderBottomWidth: "2px" }} />

        {selectedBoardId && <Board boardId={selectedBoardId} />}
      </div>
    </ThemeProvider>
  );
}

export default App;
