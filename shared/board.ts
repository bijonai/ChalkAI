import type { Component } from "@chalk-dsl/renderer-core"

export interface Step {
  components: string[]
  description: string
}
export interface Board {
  components: Component<string>[]
  steps: Step[]
}

export function createEmptyBoard(): Board {
  return {
    components: [],
    steps: [],
  }
}
