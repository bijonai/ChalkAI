<script setup lang="ts">
import { createBox, registerPrefab, definePrefab } from '@chalk-dsl/renderer-runtime'

registerPrefab('prefab1', definePrefab<'prefab1'>(() => {
  return {
    name: 'prefab1',
    validator: () => true,
    generator: (props, children) => {
      return document.createTextNode('prefab1')
    },
  }
}))

const { render, onError } = createBox([
  {
    name: 'Root',
    props: [],
    root: {
      name: 'prefab1',
      attrs: {},
      children: [],
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
  render(root.value)
})
</script>

<template>
  <div ref="root"></div>
</template>