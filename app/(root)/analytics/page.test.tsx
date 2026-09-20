import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import AnalyticsPage from "./page";

describe("Analytics Page Client Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders the analytics page component", () => {
    render(<AnalyticsPage />);
    expect(screen.getByText("Analytics Page")).toBeInTheDocument();
  });
});
