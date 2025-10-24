# Chalk DSL Development Guide

## Prefab

### Definition

1. Define the attributes of the prefab

```ts
interface PrefabAttributes {
  num: number
}
```

2. Define a prefab

```ts
const prefab = definePrefab<'prefab-name', PrefabAttributes>((context, _) => {
  return {
    name: 'prefab-name',
    validator: () => true, // Optional, return a boolean to indicate if the attributes are valid
    generator: (attrs, children) => {
      console.log(attrs.num)
      const element = document.createElement('div')
      element.innerHTML = `Hello, ${attrs.num}!`
      element.append(...children()) // Children is a function to get the children of the prefab
      return element // Return the generated element
    },
  }
})
```

3. Register the prefab

```ts
registerPrefab('prefab-name', prefab)
```

<details>
<summary>Example</summary>

```json
{
  "name": "prefab-name",
  "attrs": {
    "num": 100
  },
  "children": [
    { "name": "block", "children": ["Hello!"] }
  ]
}
```

</details>

### Slot

```ts
const prefab = definePrefab<'prefab-name', PrefabAttributes>((context, _) => {
  return {
    name: 'prefab-name',
    generator: (attrs, children) => {
      // ...
      const element = document.createElement('div')
      const [slots, nodes] = useSlot<['slot1, slot2']>(children)
      const container1 = document.createElement('div')
      container1.append(...slots.slot1 ?? [])
      const container2 = document.createElement('div')
      container2.append(...slots.slot2 ?? [])
      element.append(container1, container2) // You can use the nodes to append to the element
      return element
    },
  }
})
```

<details>
<summary>Example</summary>

```json
{
  "name": "prefab-name",
  "children": [
    { "name": "block", "children": ["Hello, 1!"], "statements": { "slot": "slot1" } },
    { "name": "block", "children": ["Hello, 2!"], "statements": { "slot": "slot2" } }
  ]
}
```
</details>

### Provide & Inject

#### Provide

```ts
const prefab = definePrefab<'parent-prefab-name', PrefabAttributes>((context, _) => {
  return {
    name: 'prefab-name',
    generator: (attrs, children) => {
      // ...
    },
    provides: {
      x: 10,
    }
  }
})
```

#### Inject

```ts
interface ParentPrefabAttributes {
  // ...
}

interface ChildPrefabInjection {
  x: number
}

const prefab = definePrefab<'child-prefab-name', PrefabAttributes, ChildPrefabInjection>((context, _) => {
  return {
    name: 'prefab-name',
    generator: (attrs, children) => {
      // ...
      console.log(context.x) // 10
    },
  }
})
```

### Knowledge

```ts
const knowledge = definePrefabKnowledge((utils) => {
  // name:
  utils.name('prefab-name')
  // description:
  utils.description('the description of the prefab')
  // tags:
  utils.tag('tag1', 'tag2')
  // props:
  utils.prop('x')
    .describe('the x of the prefab')
    .type('number')
    .optional('10') // optional default value
  utils.prop('y')
    .describe('the y of the prefab')
    .type('number')
    .optional('20') // optional default value
  utils.prop('attr')
    .describe('the attribute of the prefab')
    .type('string') // required
  // examples:
  utils.example('example1')
  // rules:
  utils.rule('rule1')
  utils.rule('rule2')
  // slots:
  utils.slot('slot1', 'the description of the slot1')
  utils.slot('slot2', 'the description of the slot2')
})

addPrefabKnowledge(knowledge)
```
