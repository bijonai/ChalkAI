import type { Template } from "..";

export const paginator: Template = {
  id: 'paginator',
  content: {
    name: 'root',
    props: [],
    root: {
      name: 'paginator',
      attrs: {
        default: 'Tab-1'
      },
      children: [
        {
          id: 'tab1',
          name: 'block',
          attrs: {},
          children: [
            'Tab 1 Content'
          ],
          statements: {
            slot: 'tab:Tab-1'
          }
        },
        {
          id: 'tab1',
          name: 'block',
          attrs: {},
          children: [
            'Tab 2 Content'
          ],
          statements: {
            slot: 'tab:Tab-2'
          }
        }
      ]
    }
  }
}