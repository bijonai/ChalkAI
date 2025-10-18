<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import type { ClassroomCardProps } from '~/components/ClassroomCard.vue'

const open = ref(false)

const classrooms = ref<ClassroomCardProps[]>([])
const createInput = ref('')
const createTitle = ref('')
const createDisable = ref(false)
const isReasoning = ref(false)
const create = async () => {
  createDisable.value = true
  const { success, data } = await $fetch('/api/classroom', {
    method: 'POST',
    body: {
      title: createTitle.value,
      input: createInput.value,
      reasoning: isReasoning.value,
    },
  })
  if (success) {
    classrooms.value.push({
      title: data.title,
      date: data.createdAt,
      status: data.status,
      createdBy: data.createdBy ?? '',
      public: data.public,
      id: data.id,
    })
    open.value = false
    createTitle.value = ''
    createInput.value = ''
    createDisable.value = false
  }
}

const getClassrooms = async () => {
  const { success, data } = await $fetch('/api/classroom')
  if (success) {
    classrooms.value.push(...data.classrooms.map(c => ({
      title: c.title,
      date: c.createdAt,
      status: c.status,
      createdBy: c.createdBy ?? '',
      public: c.public,
      id: c.id,
    })))
  }
}

onMounted(async () => {
  getClassrooms()
})
</script>


<template>
  <div class="flex size-full p-18 overflow-y-auto">
    <div class="flex size-full flex-col gap-5">
      <h1 class="text-primary text-2xl">
        Tasks
      </h1>
      <div class="flex flex-row w-full gap-2">
        <Input />
        <Button variant="accent" class="flex flex-row gap-2 w-30" @click="open = true">
          <FontAwesomeIcon class="size-4" :icon="faPlus" />
          <span>Create</span>
        </Button>
      </div>
      <div class="w-full grid md:grid-cols-3 sm:grid-cols-1 gap-2">
        <ClassroomCard v-for="c in classrooms" v-bind="c" :key="c.id" />
      </div>
    </div>
    <Transition name="fade">
      <dialog v-if="open" :open="open"
        class="fixed w-screen h-screen inset-0 z-50 bg-transparent bg-opacity-50 backdrop-blur-sm">
        <div class="flex min-h-screen items-center justify-center p-4" @click.self="open = false">
          <div
            class="w-full max-w-md p-6 bg-#1a1a1a rounded-lg border border-primary shadow-2xl transform transition-all"
            @click.stop>
            <div class="flex flex-col mb-6">
              <h1 class="text-primary text-xl font-semibold mb-2">
                Create Classroom Task
              </h1>
              <p class="text-sub text-sm">
                Start a new generating task with your requirements.
              </p>
            </div>
            <div class="flex flex-col gap-4 mb-6">
              <Input placeholder="title (optional)" class="h-10" v-model="createTitle" />
            </div>
            <div class="h-32">
              <TextArea v-model="createInput" />
            </div>
            <div class="h-32 flex items-center gap-3">
              <span class="text-sub text-sm">Reasoning</span>
              <Switch v-model:checked="isReasoning" />
            </div>
            <div class="flex justify-end gap-3 mt-6">
              <Button variant="hover" @click="open = false">
                Cancel
              </Button>
              <Button variant="accent" @click="create" :disable="createDisable">
                Create
              </Button>
            </div>
          </div>
        </div>
      </dialog>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>