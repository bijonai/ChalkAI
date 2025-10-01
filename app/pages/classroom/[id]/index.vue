<script setup lang="ts">
import type { Board } from '~~/shared'

const containers = ref<Ref<HTMLElement | null>[]>([])
const id = useRoute().params.id as string

const board = ref<Board | null>(null)

const getInfo = async () => {
  const result = await $fetch(`/api/classroom/${id}/result`)
  console.log(result)
  if (result.success) {
    board.value = result.data.result
  }
}

const { currentStep, loadBoard, next } = useBoard()

onMounted(async () => {
  await getInfo()
  if (!board.value) return
  console.log(board.value.result)
  const [steps, _render] = loadBoard(board.value!)
  containers.value.push(...steps)
  nextTick(() => _render())
  for (let i = 0; i < steps.length; i++) {
    next()
  }
})
</script>

<template>
  <div class="size-full flex">
    <div class="max-w-full overflow-y-auto w-full chalk">
      <div v-for="container in containers" :key="container.id" :ref="container" class="w-full"></div>
    </div>
  </div>
</template>