<script setup lang="ts">
const content = defineModel<string>({ default: '' })
</script>

<template>
  <input
    class="text-primary border border-primary bg-primary rounded-md p-1 size-full focus:outline-none focus:border-hover"
    v-model="content">
  </input>
</template>