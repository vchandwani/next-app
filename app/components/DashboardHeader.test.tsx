import "@testing-library/jest-dom"; // Fixes "Invalid Chai property"
import { afterEach, describe, expect, it } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import DashboardHeader from "./DashboardHeader";

describe("DashboardHeader Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the dashboard header correctly", () => {
    render(<DashboardHeader />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
