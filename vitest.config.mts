import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov', 'json-summary'],
            thresholds: {
                lines: 80,      // Minimum 80% line coverage
                functions: 80,  // Minimum 80% function coverage
                branches: 80,   // Minimum 80% branch coverage
                statements: 80  // Minimum 80% statement coverage
            },
        },
    },
})