import { KanbanDnd } from "../components/KanbanDnd";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type { TypeColumn } from "../types/kanban";
import * as kanbanStore from "../store/kanbanStore";

// Mock store and data
const boardId = "board-1";
const columns: TypeColumn[] = [
  {
    id: "col-1",
    name: "To Do",
    cards: [
      { id: "card-1", title: "Task 1", description: "", columnId: "col-1" },
      { id: "card-2", title: "Task 2", description: "", columnId: "col-1" },
    ],
    boardId: boardId,
    cardIds: ["card-1", "card-2"],
  },
  {
    id: "col-2",
    name: "Done",
    cards: [],
    boardId: boardId,
    cardIds: [],
  },
];

vi.spyOn(kanbanStore, "useKanbanStore").mockImplementation((selector) =>
  selector({
    boards: [],
    columns,
    addBoard: vi.fn(),
    setBoards: vi.fn(),
    addColumn: vi.fn(),
    setColumns: vi.fn(),
  })
);

describe("KanbanDnd", () => {
  it("renders columns and cards", () => {
    render(<KanbanDnd boardId={boardId} />);
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });
});
