<script setup lang="ts">
import { createBox, registerPrefab, definePrefab } from '@chalk-dsl/renderer-runtime'

registerPrefab('prefab1', definePrefab<'prefab1'>((context) => {
  return {
    name: 'prefab1',
    validator: () => true,
    generator: (props, children) => {
      const ele = document.createElement('div')
      ele.appendChild(document.createTextNode(props.n.toString()))
      ele.append(...children())
      return ele
    },
  }
}))

const { render, onError, setActiveContext, getActiveContext } = createBox([
  {
    name: 'Root',
    props: [],
    root: {
      name: 'prefab1',
      attrs: {
        n: '{{x}}'
      },
      children: [
        {
          name: 'prefab1',
          attrs: {
            n: '{{x}}'
          },
          children: [],
          events: {},
          statements: {},
        }
      ],
      events: {},
      statements: {},
    },
  }
])

onError((error) => {
  console.error(error)
})

const root = ref<HTMLElement>()

onMounted(() => {
  if (!root.value) return
  setActiveContext({
    x: 0
  })
  render(root.value)
  setInterval(() => {
    getActiveContext().x += 1
  }, 1000)
})
</script>

<template>
  <div ref="root"></div>
</template>