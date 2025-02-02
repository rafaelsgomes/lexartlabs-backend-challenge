import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import tsconfigpaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    root: './',
  },
  plugins: [
    tsconfigpaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})
