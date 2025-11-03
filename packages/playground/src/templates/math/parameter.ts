import type { Template } from "..";

export const parameter: Template = {
  id: 'parameter',
  content: `
---
name: Parameter
props: []
refs:
  expr: '(t) => [Math.sin(t), Math.cos(t)]'
  domain: [0, 10]
  range: [0, 10]
  color: 'primary'
---
<canvas>
  <plane :range="[-10, 10]" :domain="[-10, 10]">
    <parameter :expr="(t) => [Math.sin(t) * 3, Math.cos(t) / 2]" :domain="[-10, 10]" :range="[-10, 10]" color="primary" />
  </plane>
</canvas>
  `.trim()
}