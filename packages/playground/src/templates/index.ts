import type { Component } from "@chalk-dsl/renderer-runtime"
import { grid } from "./layout/grid"
import { columns } from "./layout/col-row"
import { test1 } from "./tests/test1"
import { conditionTest } from "./tests/condition-test"
import { input } from "./form/input"
import { chooser } from "./form/chooser"
import { table } from "./widget/table"
import { code } from "./widget/code"
import { test2 } from "./tests/test2"
import { stringMergeTest } from "./tests/string-merge-test"
import { paginator } from "./widget/paginator"

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
      test2,
      stringMergeTest,
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
      code,
      paginator
    ]
  }
] as Template[]