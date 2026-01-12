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
  it("renderiza o título e campo de texto", () => {
    render(<DialogBox {...defaultProps} />);
    expect(screen.getByText(/coluna/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it("chama setNew ao digitar no campo", () => {
    render(<DialogBox {...defaultProps} />);
    const input = screen.getByLabelText(/name/i);
    fireEvent.change(input, { target: { value: "Minha coluna" } });
    expect(defaultProps.setNew).toHaveBeenCalledWith({ name: "Minha coluna" });
  });

  it("desabilita o botão Criar se campo vazio", () => {
    render(<DialogBox {...defaultProps} />);
    const button = screen.getByText(/Criar/i);
    expect(button).toBeDisabled();
  });

  it("habilita o botão Criar se campo preenchido", () => {
    render(<DialogBox {...defaultProps} newValues={{ name: "Teste" }} />);
    const button = screen.getByText(/Criar/i);
    expect(button).not.toBeDisabled();
  });

  it("chama onClose ao clicar em Cancelar", () => {
    render(<DialogBox {...defaultProps} />);
    const button = screen.getByText(/Cancelar/i);
    fireEvent.click(button);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
