import type { Template } from ".."

const content = `
---
name: Dot
props: []
refs:
  position: [0, 0]
---
<canvas>
  <polygon :points="[[0, 0], [0, 5], [5, 5], [5, 0]]" />
  <dot :position="[0, 0]" color="primary" label="O"/>
  <dot :position="[5, 0]" color="primary" label="A"/>
</canvas>
`.trim()

export const dot: Template = {
  id: 'dot',
  content
}