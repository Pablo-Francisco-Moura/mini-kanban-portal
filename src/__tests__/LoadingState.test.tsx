import { LoadingState } from "../components/LoadingState";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("i18next", () => ({
  t: (key: string, params?: Record<string, unknown>) => {
    const translations: Record<string, string> = {
      loading_db: "Loading database information...",
      countdown: `Waiting for the server to respond: ${params?.seconds}s`,
      progress_label: `Progress: ${params?.percent}%`,
    };
    return translations[key] ?? key;
  },
}));

describe("LoadingState", () => {
  it("renders the countdown and progress bar", () => {
    render(
      <LoadingState open={true} countdownSeconds={60} progressPercent={50} />,
    );

    expect(
      screen.getByText(/Waiting for the server to respond: 60s/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Progress: 50%/i)).toBeInTheDocument();
  });

  it("renders the timeout error message", () => {
    render(
      <LoadingState
        open={true}
        countdownSeconds={0}
        progressPercent={100}
        errorMessage="The server could not load the information. Please try again in a few moments."
      />,
    );

    expect(
      screen.getByText(/The server could not load the information/i),
    ).toBeInTheDocument();
  });
});
