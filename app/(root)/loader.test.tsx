import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import Loader from "./loader";

describe("Loader Client Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders the loader component", () => {
    render(<Loader />);
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  });
});
