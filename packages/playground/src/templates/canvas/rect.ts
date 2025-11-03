import type { Template } from "..";

export const rect: Template = {
  id: 'rect',
  content: `
---
name: Rect
props: []
refs:
  d: "6"
  f: "(x) => -0.1 * x * x + 8"
---
<slider model="d" :min="1" :max="100" :step="1" title="矩形数量" />
<canvas>
  <plane :range="[-10, 10]" :domain="[-10, 10]">
    <function :expr="f" :domain="[-9, 9]" :range="[-10, 10]" color="accent" />
    <rect :position="[i * (18 / d) - 9 - (18 / d) / 2, f(9)]" :width="18 / d" :height="-f(-9 + i * (18 / d))" #for="i in Array.from({ length: d + 1 }, (_, i) => i)" fill="info"/>
  </plane>
</canvas>

<block #for="i in Array.from({ length: d }, (_, i) => i)">{{ i }}</block>

`.trim()
}