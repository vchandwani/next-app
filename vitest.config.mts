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
            all: true,
            include: [
                'app/**/*.{ts,tsx}',
                'components/**/*.{ts,tsx}',
                'lib/**/*.{ts,tsx}'
            ],

            // 3. Exclude files that shouldn't or can't be tested
            exclude: [
                '**/*.d.ts',          // Exclude TypeScript type declarations
                'app/**/layout.tsx',  // Next.js layouts are notoriously hard to unit test
                'app/**/loading.tsx'  // Exclude simple UI wrappers if desired
            ],

            // 4. Enforce the pass percentage
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80
            },
        },
    },
})