import { parseComponent } from "../src"

const content = `
---
name: component
props:
  - name
  - items
refs:
  - items: items
---
<component :name="Hello World" @click="console.log('Hello World')" #for="item in items">
Hello
World
  <div>
    <h1>Hello, world!</h1>
  </div>
</component>
`

const result = parseComponent(content)

console.log(result)
