import { DialogBox } from "../components/DialogBox";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const defaultProps = {
  open: true,
  label: "coluna",
  fields: ["name"],
  loading: false,
  newValues: { name: "" },
  action: vi.fn(),
  setNew: vi.fn(),
  onClose: vi.fn(),
};

vi.mock("i18next", () => ({ t: (key: string) => key }));

describe("DialogBox", () => {
  it("Render the title and text field.", () => {
    render(<DialogBox {...defaultProps} />);
    expect(screen.getByText(/coluna/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it("Calls setNew when typing in the field.", () => {
    render(<DialogBox {...defaultProps} />);
    const input = screen.getByLabelText(/name/i);
    fireEvent.change(input, { target: { value: "My column" } });
    expect(defaultProps.setNew).toHaveBeenCalledWith({ name: "My column" });
  });

  it("Disables the Create button if the field is empty.", () => {
    render(<DialogBox {...defaultProps} />);
    const button = screen
      .getAllByRole("button")
      .find((btn) => /criar|create/i.test(btn.textContent || ""));
    expect(button).toBeDefined();
    if (button) expect(button).toBeDisabled();
  });

  it("Enables the Create button if the field is filled.", () => {
    render(<DialogBox {...defaultProps} newValues={{ name: "Test" }} />);
    const button = screen
      .getAllByRole("button")
      .find((btn) => /criar|create/i.test(btn.textContent || ""));
    expect(button).toBeDefined();
    if (button) expect(button).not.toBeDisabled();
  });

  it("Calls onClose when clicking Cancel", () => {
    render(<DialogBox {...defaultProps} />);
    // Busca o botão pelo papel e pelo texto (aceita variações de tradução)
    const button = screen
      .getAllByRole("button")
      .find((btn) => /cancelar|cancel|cancela/i.test(btn.textContent || ""));
    expect(button).toBeDefined();
    if (button) fireEvent.click(button);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
