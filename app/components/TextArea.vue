<script setup lang="ts">
const content = defineModel<string>({ default: '' })
</script>

<template>
  <textarea class="resize-none text-primary border border-primary bg-primary rounded-md p-1 size-full focus:outline-none focus:border-hover bg-hover" v-model="content">
  </textarea>
</template>