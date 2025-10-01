<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCalendar, faUser, faLock, faBook } from '@fortawesome/free-solid-svg-icons';

export interface ClassroomCardProps   {
  title: string
  date: string
  status?: string
  createdBy: string
  public: boolean
  id: string
}

const props = defineProps<ClassroomCardProps>()
</script>

<template>
  <div
    class="flex size-full flex-col gap-2 text-primary border border-primary bg-primary rounded-md p-3 hover:bg-hover hover:cursor-pointer hover:border-hover">
    <div class="flex flex-row w-full justify-between items-center gap-2">
      <h2 class="text-lg">{{ props.title }}</h2>
      <FontAwesomeIcon class="size-3 text-sub hover:text-primary" :icon="props.public ? faBook : faLock" />
      <span class="flex ml-auto">{{ props.status }}</span>
    </div>
    <div class="flex flex-row w-full justify-between items-center gap-2">
      <FontAwesomeIcon class="size-3 text-white" :icon="faUser" />
      <span class="text-sm mr-auto">{{ props.createdBy }}</span>
    </div>
    <div class="flex flex-row w-full justify-between items-center gap-2">
      <FontAwesomeIcon class="size-3 text-white" :icon="faCalendar" />
      <span class="text-sm mr-auto">{{ props.date }}</span>
    </div>
  </div>
</template>