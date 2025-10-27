<script setup lang="ts">
import type { Board } from '~~/shared'
import { createHighlighter } from 'shiki'

const containers = ref<Ref<HTMLElement | null>[]>([])
const id = useRoute().params.id as string

const board = ref<Board | null>(null)

const getInfo = async () => {
  const { data } = await $fetch(`/api/classroom/${id}/result`)
  if (data && 'result' in data) {
    board.value = data.result
  }
}

const { loadBoard } = useBoard()

onMounted(async () => {
  try {
    await getInfo()
    if (!board.value) return
    const [steps, _render] = loadBoard(board.value)
    containers.value.push(...steps)
    nextTick(() => {
      _render()
    })
  } catch (error) {
    console.error(error)
  }
})

const { app: { buildId } } = useRuntimeConfig()
const debug = ref(true)
</script>

<template>
  <div class="size-full flex flex-row">
    <div
      v-if="buildId === 'dev'"
      class="fixed z-0 right-0 flex pre"
      :class="{
        'h-full w-1/2': !debug,
      }"
    >
      <Debug :board="board" v-model:hide="debug" />
    </div>
    <div class="min-w-full max-w-full overflow-y-auto chalk-board flex flex-col items-center gap-10 px-36">
      <div
        v-for="(container, index) in containers"
        :key="index"
        :ref="container"
        class="w-full"
      />
    </div>
  </div>
</template>

<style scoped>
.pre {
  padding: 30px;
}
</style>