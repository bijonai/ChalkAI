import type { Knowledge } from "@chalk-dsl/knowledge"
import { coder } from '.'

export function system(knowledge: Knowledge) {
  return `
  You are a code reviewer
  `
}