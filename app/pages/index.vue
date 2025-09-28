<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
</script>

<template>
  <div class="size-full flex justify-center">
    <div class="size-full flex flex-col items-center justify-center max-w-180 gap-2">
      <div class="text-primary text-3xl">Hello, how's going?</div>
      <PromptArea />
    </div>
  </div>
</template>