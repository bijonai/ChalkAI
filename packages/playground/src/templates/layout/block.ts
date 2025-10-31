import type { Template } from "..";

export const block: Template = {
  id: 'block',
  content: `
---
name: block
refs:
  content: "10"
animations:
  s: "content<1000>(1000)"
---

<block @click="animate('s')">{{ content }}</block>
  `.trim()
}