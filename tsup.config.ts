import { defineConfig } from 'tsup'

export default defineConfig({
  format: 'esm',
  target: 'esnext',
  noExternal: [
    '@chalk-dsl/renderer-core',
    '@chalk-dsl/renderer-runtime',
    '@chalk-dsl/knowledge',
    '@chalk-dsl/layout'
  ],
  env: {
    NODE_ENV: 'dev',
    DEBUG: '*'
  }
})
