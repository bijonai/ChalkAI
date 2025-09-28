<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'accent' | 'hover'
}>(), {
  variant: 'primary'
})
</script>


<template>
  <div 
  :class="{
    'bg-primary hover:bg-hover hover:border-hover': variant === 'primary',
    'bg-accent hover:bg-accent-hover border-accent': variant === 'accent',
    'bg-hover hover:border-hover': variant === 'hover',
  }"
  class="text-primary border border-primary rounded-md p-1 size-full flex items-center justify-center cursor-pointer transition-all duration-300">
    <slot />
  </div>
</template>