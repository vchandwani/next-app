import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Automatically clean up the DOM after every single test
afterEach(() => {
    cleanup();
});