import { parseX } from "../src"

const content = `
<component :name="Hello World" @click="console.log('Hello World')" #for="item in items">
Hello
World
  <div>
    <h1>Hello, world!</h1>
  </div>
</component>
`

const result = parseX(content)

console.log(result)
