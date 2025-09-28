import type { Component } from "@chalk-dsl/renderer-core"

export type Template = {
  id: string
  content?: Component<string>
  templates?: Template[]
}

export default [
  {
    id: 'text',
    content: {
      name: 'text',
      props: [],
      root: {
        name: 'text',
        attrs: { text: 'Hello, world!' },
      },
    },
    templates: [
      {
        id: 'text-2',
        content: {
          name: 'root',
          props: [],
          root: {
            name: 'text',
            attrs: { text: 'Hello, world!' },
          },
        },
      },
    ],
  },
] as Template[]