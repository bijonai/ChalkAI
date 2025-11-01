import type { Template } from "..";

export const axis: Template = {
  id: 'axis',
  content: `
---
name: Axis
props: []
refs:
  range: [-10, 10]
  domain: [-10, 10]
---
<canvas>
  <axis :range="[-5, 5]">
  </axis>
</canvas>
  `.trim()
}