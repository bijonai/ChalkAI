<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const emit = defineEmits<{
  (e: 'submit', value: string): void
}>()
const content = defineModel<string>({ default: '' })
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <div class="w-full h-32">
      <TextArea v-model="content" />
    </div>
    <div class="w-full h-8 flex flex-row">
      <Button
        variant="accent"
        class="w-10 ml-auto flex flex-row gap-2 hover:w-20 hover:transition-all hover:duration-300 group"
        @click="emit('submit', content)">
        <FontAwesomeIcon class="size-4" :icon="faPaperPlane" />
      </Button>
    </div>
  </div>
</template>