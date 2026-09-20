import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import AnalyticsPage from "./page";

describe("AnalyticsPage Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the analytics page", () => {
    render(<AnalyticsPage />);
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    // Add specific assertions for the AnalyticsPage content here
  });
});
