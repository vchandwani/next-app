import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import UserDetails from "./page";

describe("UserDetails Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the user details page with resolved params", async () => {
    const params = Promise.resolve({ id: "123" });

    // Await the Async Server Component execution to resolve JSX
    const ResolvedComponent = await UserDetails({ params });
    render(ResolvedComponent);

    expect(screen.getByRole("heading", { level: 1, name: "Showing Details" })).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
  });
});
