import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import NewUser from "./page";

describe("NewUser Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the new user page", () => {
    render(<NewUser />);
    expect(screen.getByText("new User")).toBeInTheDocument();
    // Add specific assertions for the NewUser content here
  });
});
