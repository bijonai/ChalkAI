<script setup lang="ts">
import { registerPrefab, definePrefab } from '@chalk-dsl/renderer-runtime'
const { currentStep, loadBoard, next } = useBoard()
const pages = ref<Ref<HTMLElement | null>[]>([])

registerPrefab('text', definePrefab<'text', { text: string }>((ctx) => ({
  name: 'text',
  generator: (props, children) => {
    return document.createTextNode(props.text)
  }
})))

// fetch('').then(async (res) => {
//   const [_pages, render] = loadBoard(await res.json())
//   pages.value = _pages
//   onMounted(() => {
//     render()
//   })
// })

const [_pages, render] = loadBoard({
  steps: [{ component: 'Page-1', description: 'Page 1' }, { component: 'Page-2', description: 'Page 2' }],
  components: [
    {
      name: 'Page-1',
      props: [],
      root: {
        name: 'text',
        attrs: { text: 'Page 1' },
        events: {},
        statements: {},
        children: [],
      }
    },
    {
      name: 'Page-2',
      props: [],
      root: {
        name: 'text',
        attrs: { text: 'Page 2' },
        events: {},
        statements: {},
        children: [],
      }
    }
  ]
})
pages.value = _pages
onMounted(() => {
  render()
  setTimeout(() => {
    next()
  }, 2000)
})
</script>

<template>
  <div class="flex flex-col">
    <div v-for="(page, index) in pages" :key="index" :ref="page" class="min-h-screen min-w-screen max-h-screen max-w-screen"></div>
  </div>
</template>