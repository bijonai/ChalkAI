import type { Template } from "..";

export const chooser: Template = {
  id: 'chooser',
  content: {
    name: 'chooser',
    props: [],
    refs: {
      option: 'null',
    },
    root: {
      name: 'chooser',
      attrs: {
        width: '100%',
        title: 'Question 1',
        type: 'multiple',
        model: 'option',
      },
      children: [
        { name: 'block', children: ['Current Option: {{ option }}'], statements: { slot: 'content' } },
        { name: 'block', children: ['Option 1'], statements: { slot: 'option:1' } },
        { name: 'block', children: ['Option 2'], statements: { slot: 'option:2' } },
      ],
    }
  }
}