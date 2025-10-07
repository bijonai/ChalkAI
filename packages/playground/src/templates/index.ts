import type { Component } from "@chalk-dsl/renderer-runtime"
import { grid } from "./layout/grid"
import { columns } from "./layout/col-row"
import { test1 } from "./tests/test1"
import { conditionTest } from "./tests/condition-test"
import { input } from "./form/input"
import { chooser } from "./form/chooser"
import { table } from "./widget/table"

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
      conditionTest,
    ]
  },
  {
    id: 'form',
    templates: [
      input,
      chooser,
    ]
  },
  {
    id: 'widget',
    templates: [
      table,
    ]
  }
] as Template[]