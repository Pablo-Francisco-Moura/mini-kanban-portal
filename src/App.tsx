import { Board } from "./components/Board";
import { useState } from "react";
import { BoardList } from "./components/BoardList";
import { Divider, Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

  return (
    <>
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
        <Divider sx={{ borderBottomWidth: "2px" }} />

        <BoardList
          onSelectBoard={setSelectedBoardId}
          selectedBoardId={selectedBoardId}
        />

        <Divider sx={{ borderBottomWidth: "2px" }} />

        {selectedBoardId && <Board boardId={selectedBoardId} />}
      </div>
    </>
  );
}

export default App;
