import type { Component } from "@chalk-dsl/renderer-runtime"
import { grid } from "./layout/grid"
import { columns } from "./layout/col-row"

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
  }
] as Template[]