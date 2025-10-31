import type { Template } from ".."

const content = `
---
name: Dot
props: []
refs:
  position: [0, 0]
---
<canvas>
  <dot :position="[0, 0]" color="primary" />
</canvas>
`.trim()

export const dot: Template = {
  id: 'dot',
  content
}