import { Board } from "./components/Board";
import { useState } from "react";
import { BoardList } from "./components/BoardList";
import CssBaseline from "@mui/material/CssBaseline";
import { Divider, Typography } from "@mui/material";

function App() {
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

  console.log("selectedBoardId: ", selectedBoardId);

  return (
    <>
      <CssBaseline />
      <div
        style={{
          width: "100vw",
          // border: "10px solid red",
          height: "100vh",
          display: "flex",
          maxWidth: "100vw",
          maxHeight: "100vh",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{
            variant: "h1",
            padding: "20px",
            fontSize: "24px",
            fontWeight: "bold",
            // border: "10px solid red",
          }}
        >
          Mini Kanban Portal
        </Typography>
        <Divider sx={{ borderBottomWidth: "2px", mx: "12px" }} />

        <BoardList
          onSelectBoard={setSelectedBoardId}
          selectedBoardId={selectedBoardId}
        />

        <Divider sx={{ borderBottomWidth: "2px", mx: "12px" }} />
      </div>
    </>
  );
}

export default App;
