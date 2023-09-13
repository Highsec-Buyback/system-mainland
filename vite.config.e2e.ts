/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    include: ['**/*.{e2e}.?(c|m)[jt]s?(x)']
  },
})