import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: false,
  minify: false,
  banner: {
    js: '#!/usr/bin/env node'
  },
  target: 'node18',
  external: ['fs-extra', '@clack/prompts']
})