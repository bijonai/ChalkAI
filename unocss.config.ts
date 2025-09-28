import { defineConfig } from 'unocss'

export default defineConfig({
  rules: [
    ['bg-primary', { 'background-color': '#111111' }],
    ['border-primary', { 'border-color': '#303030' }],
    ['text-sub', { 'color': 'color-mix(in srgb, #b6b7b8, transparent 40%)' }],
    ['text-primary', { 'color': '#ffffff' }],
    ['bg-hover', { 'background-color': '#1A1A1A' }],
    ['border-hover', { 'border-color': '#4F4F4F' }],
    ['bg-accent', { 'background-color': '#FFA50080' }],
    ['border-accent', { 'border-color': '#FFA500' }],
    ['bg-accent-hover', { 'background-color': '#FFA500AA' }],
  ]
})