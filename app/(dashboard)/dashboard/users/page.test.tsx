import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import UsersPage from "./page";

// Mock next/link to simplify DOM assertions
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

describe("UsersPage Server Component", () => {
  const mockUsers = [
    { id: 1, name: "Leanne Graham", email: "Sincere@april.biz" },
    { id: 2, name: "Ervin Howell", email: "Shanna@melissa.tv" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("fetches and renders the users table with correct attributes and links", async () => {
    // Mock global fetch
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    });
    vi.stubGlobal("fetch", mockFetch);

    // Resolve RSC promise
    const ResolvedPage = await UsersPage();
    render(ResolvedPage);

    // Verify fetch was called with correct endpoint and cache settings
    expect(mockFetch).toHaveBeenCalledWith("https://jsonplaceholder.typicode.com/users", { cache: "no-store" });

    // Check heading
    expect(screen.getByRole("heading", { level: 1, name: "Users" })).toBeInTheDocument();

    // Check table headers
    expect(screen.getByRole("columnheader", { name: "ID" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Email" })).toBeInTheDocument();

    // Check rendered user details
    expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    expect(screen.getByText("Sincere@april.biz")).toBeInTheDocument();
    expect(screen.getByText("Ervin Howell")).toBeInTheDocument();
    expect(screen.getByText("Shanna@melissa.tv")).toBeInTheDocument();

    // Check Next.js navigation link hrefs
    const linkUser1 = screen.getByRole("link", { name: "1" });
    expect(linkUser1).toHaveAttribute("href", "/dashboard/users/1");

    const linkUser2 = screen.getByRole("link", { name: "2" });
    expect(linkUser2).toHaveAttribute("href", "/dashboard/users/2");
  });

  it("renders an empty table body when no users are returned", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    vi.stubGlobal("fetch", mockFetch);

    const ResolvedPage = await UsersPage();
    render(ResolvedPage);

    expect(screen.getByRole("heading", { level: 1, name: "Users" })).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
