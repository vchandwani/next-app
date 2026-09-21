import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import AboutPage from "./page";

describe("About Page Client Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders the about page component", () => {
    render(<AboutPage />);
    expect(screen.getByText("About Events")).toBeInTheDocument();
  });
});
