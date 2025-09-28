import type { Component } from "@chalk-dsl/renderer-runtime"
import { grid } from "./layout/grid"
import { columns } from "./layout/col-row"
import { test1 } from "./tests/test1"

export type Template = {
  id: string
  content?: Component<string>
  templates?: Template[]
}

export default [
  {
    id: 'layout',
    templates: [
      grid,
      columns,
    ]
  },
  {
    id: 'tests',
    templates: [
      test1,
    ]
  }
] as Template[]