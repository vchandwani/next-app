import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import Layout from "./layout";

// Mock next/font/google functions
vi.mock("next/font/google", () => ({
  Schibsted_Grotesk: () => ({
    variable: "--font-schibsted-grotesk",
  }),
  Martian_Mono: () => ({
    variable: "--font-martian-mono",
  }),
}));

// Mock child components to isolate layout unit test
vi.mock("@/components/LightRays", () => ({
  default: () => <div data-testid="light-rays" />,
}));

vi.mock("./components/Navbar", () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock("next/font/google", () => ({
  Schibsted_Grotesk: () => ({ variable: "--font-schibsted-grotesk" }),
  Martian_Mono: () => ({ variable: "--font-martian-mono" }),
  Inter: () => ({ variable: "--font-inter" }),
}));

describe("Layout Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the layout with children and layout components", () => {
    render(
      <Layout>
        <div>Test Child</div>
      </Layout>,
    );

    expect(screen.getByText("Test Child")).toBeInTheDocument();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("light-rays")).toBeInTheDocument();
  });
});
