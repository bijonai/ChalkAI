import type { Template } from "..";

export const block: Template = {
  id: 'block',
  content: `
---
name: block
refs:
  content: "0"
  state: "false"
animations:
  s: "{(x) => x * x}content<1000>(state ? 0 : 10)"
---

<canvas :range="[-10, 10]">
  <arc :position="[content, 0]" :radius="0.5" fill="primary" />
</canvas>
<button label="Start" @click="animate('s'); content = 10; state = !state"></button>
  `.trim()
}