<script setup lang="ts">
const content = defineModel<string>({ default: '' })
</script>

<template>
  <input
    v-model="content"
    class="text-primary border border-primary bg-primary rounded-md py-1 px-2 size-full focus:outline-none focus:border-hover"
  >
  </input>
</template>