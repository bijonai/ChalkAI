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


