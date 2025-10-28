<script setup lang="ts">
const content = defineModel<string>({ default: '' })
</script>

<template>
  <textarea
    v-model="content"
    class="resize-none text-primary border border-primary bg-primary rounded-md py-1 px-2 size-full focus:outline-none focus:border-hover bg-hover"
  />
</template>