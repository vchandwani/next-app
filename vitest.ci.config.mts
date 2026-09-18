import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from './vitest.config.mts'

export default mergeConfig(
    baseConfig,
    defineConfig({
        test: {
            coverage: {
                include: ['app/components/ThemeToggle.tsx']
            }
        }
    })
)
