import { createParser } from "../parser"
import { createEmptyBoard } from "../../shared"

const board = createEmptyBoard()
const parser = createParser(board)

parser(`\`\`\`component
---
name: TrigIntro
refs:
  angle: 45
---
<element>
  <child/>
</element>
  \`\`\``)

console.log(board)