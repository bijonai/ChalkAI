<script setup lang="ts">
import { registerPrefab, definePrefab, registerAnimationPreset, defineAnimationPreset } from '@chalk-dsl/renderer-runtime'
const { currentStep, loadBoard, next } = useBoard()
const pages = ref<Ref<HTMLElement | null>[]>([])

registerPrefab('text', definePrefab<'text', { text: string }>((ctx) => ({
  name: 'text',
  generator: (props, children) => {
    const div = document.createElement('div')
    div.textContent = props.text
    div.style.fontSize = '100px'
    return div
  }
})))

registerAnimationPreset('move', defineAnimationPreset((params, { node }) => {
  return (progress) => {
    node!.style.transform = `rotate(${progress * 1000}deg)`
  }
}))

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
      refs: {
        num: '2222'
      },
      root: {
        name: 'text',
        attrs: { text: '{{ num + test() }}' },
        events: {
          click: 'console.log(num += 1)',
        },
        statements: {},
        children: [],
        animations: {
          $start: [
            { preset: 'move', params: {}, duration: 1000 },
            { preset: 'num', params: { from: 0, to: 100 }, duration: 1000 }
          ]
        }
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
  <div class="flex flex-col w-full h-full">
    <div v-for="(page, index) in pages" :key="index" :ref="page" class="flex w-full"></div>
  </div>
</template>