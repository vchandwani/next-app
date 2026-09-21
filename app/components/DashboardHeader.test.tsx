import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardHeader from "./DashboardHeader";

describe("DashboardHeader Component", () => {
  it("renders the dashboard header correctly", () => {
    render(<DashboardHeader />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
