<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCalendar, faUser, faLock, faBook, faTrash, faSpinner, faRefresh } from '@fortawesome/free-solid-svg-icons';

export interface ClassroomCardProps   {
  title: string
  date: string
  status?: string
  createdBy: string
  public: boolean
  id: string
}

const props = defineProps<ClassroomCardProps>()

const emit = defineEmits<{
  (e: 'delete', id: string): Promise<void>
  (e: 'refresh', id: string): Promise<void>
}>()

const isDeleting = ref(false)
const isRefreshing = ref(false)
const deleteClassroom = async () => {
  isDeleting.value = true
  await emit('delete', props.id)
  isDeleting.value = false
}

const refreshClassroom = async () => {
  isRefreshing.value = true
  await emit('refresh', props.id)
  isRefreshing.value = false
}
</script>

<template>
  <div
    class="flex size-full flex-col gap-2 text-primary border border-primary bg-primary rounded-md p-3 hover:bg-hover hover:cursor-pointer hover:border-hover"
    @click="navigateTo(`/classroom/${props.id}`)"
  >
    <div class="flex flex-row w-full justify-between items-center gap-2">
      <h2 class="text-lg">
        {{ props.title }}
      </h2>
      <FontAwesomeIcon
        class="size-3 text-sub hover:text-primary"
        :icon="props.public ? faBook : faLock"
      />
      <span class="flex ml-auto">{{ props.status }}</span>
    </div>
    <div class="flex flex-row w-full justify-between items-center gap-2">
      <FontAwesomeIcon
        class="size-3 text-white"
        :icon="faUser"
      />
      <span class="text-sm mr-auto">{{ props.createdBy }}</span>
    </div>
    <div class="flex flex-row w-full justify-between items-center gap-2">
      <FontAwesomeIcon
        class="size-3 text-white"
        :icon="faCalendar"
      />
      <span class="text-sm mr-auto">{{ props.date }}</span>
    </div>
    <div class="flex flex-row w-full justify-end items-center gap-2">
      <div class="size-6">
        <Button
          class="p-1"
          @click.stop="deleteClassroom"
        >
          <FontAwesomeIcon
            class="size-3 text-white"
            :disabled="isDeleting"
            :icon="faTrash"
          />
        </Button>
      </div>
      <div class="size-6">
        <Button
          class="p-1"
          @click.stop="refreshClassroom"
        >
          <!-- 加载 -->
          <FontAwesomeIcon
            class="size-3 text-white"
            :class="{ 'animate-spin': isRefreshing }"
            :disabled="isRefreshing"
            :icon="faRefresh"
          />
        </Button>
      </div>
    </div>
  </div>
</template>