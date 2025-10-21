<script setup lang="ts">
import type { Board } from '~~/shared'

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
  await getInfo()
  if (!board.value) return
  const [steps, _render] = loadBoard(board.value)
  containers.value.push(...steps)
  nextTick(() => {
    _render()
    // setInterval(() => {
    //   next()
    // }, 100)
  })
})
</script>

<template>
  <div class="size-full flex">
    <div class="max-w-full overflow-y-auto w-full chalk-board flex flex-col items-center gap-10 px-36">
      <div 
        v-for="(container, index) in containers" :key="index" :ref="container"
        class="w-full"
      ></div>
    </div>
  </div>
</template>