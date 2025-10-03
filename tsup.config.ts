import { defineConfig } from 'tsup'

export default defineConfig({
  format: 'esm',
  target: 'esnext',
  noExternal: [
    '@chalk-dsl/renderer-core',
    '@chalk-dsl/renderer-runtime',
    '@chalk-dsl/knowledge',
    '@chalk-dsl/theme-default',
    '@chalk-dsl/utils-theme',
    '@chalk-dsl/layout',
    '@chalk-dsl/form',
  ],
  env: {
    NODE_ENV: 'dev',
    DEBUG: '*'
  }
})
