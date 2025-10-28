<script setup lang="ts">
import { createHighlighter } from 'shiki'
import type { Board } from '~~/shared';
import { parseComponentInfo } from '@chalk-dsl/renderer-runtime'

const hide = defineModel<boolean>('hide', { default: true })

const { board } = defineProps<{
  board: Board | null
}>()

const highlighter = await createHighlighter({
  themes: ['github-dark'],
  langs: [
    'xml'
  ],
})

const getName = (content: string) => {
  const { name } = parseComponentInfo(content)
  return name
}

const current = ref<string>('')
const names = ref<string[]>([])

watch(() => board, () => {
  if (!board) return
  names.value = board.components.map(c => getName(c as string))
  current.value = names.value[0] ?? ''
})

const content = computed(() => {
  if (!board) return '' 
  return highlighter.codeToHtml(board.components.find(c => getName(c as string) === current.value) as string, {
    lang: 'xml',
    theme: 'github-dark',
    tabindex: 2
  })
})


</script>

<template>
  <div
    v-if="!hide"
    class="flex flex-row h-full w-full bg-white border p-2 gap-2 pointer-events-auto"
  >
    <div class="h-full flex flex-col gap-1 p-1">
      <div class="flex flex-col gap-1 h-full">
        <div
          v-for="(step, index) in board?.steps"
          :key="index"
          class=" text-gray-800 border-b border-gray-800 select-none cursor-pointer"
        >
          <div>
            <span
              v-if="step.conditional"
              class="text-gray-400 border border-sky-3 bg-sky-1 text-xs p-1 rounded-md mr-2"
            >conditional</span>
            <span>{{ index + 1 }}. {{ step.description }}</span>
          </div>
          <div class="pl-4">
            <div
              v-for="(component, i) in step.components"
              :key="i"
              class="hover:text-sky-2"
              @click="current = component"
            >
              <span>{{ component }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col h-full mb-auto justify-end">
          <div
            v-show="!hide"
            class="h-8 w-20 flex"
          >
            <Button
              variant="accent"
              @click="hide = true"
            >
              Hide
            </Button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-full overflow-x-auto overflow-y-auto h-full max-h-full p-2 pre"
      v-html="content"
    />
  </div>
  <div class="w-full flex flex-row justify-end mr-auto pointer-events-auto">
    <div
      v-show="hide"
      class="h-8 w-20 flex"
    >
      <Button
        variant="accent"
        @click="hide = false"
      >
        Debug
      </Button>
    </div>
  </div>
</template>

<style scoped>
.pre pre {
  padding: 10px;
  margin: 10px;
}
</style>
