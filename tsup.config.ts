import { defineConfig } from 'tsup'

export default defineConfig({
  format: 'esm',
  target: 'esnext',
  noExternal: ['@chalk-dsl/knowledge'],
  env: {
    NODE_ENV: 'dev',
    DEBUG: '*'
  }
})
