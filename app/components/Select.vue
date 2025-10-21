<script setup lang="ts">
interface Option {
  label: string
  value: string | number
}

defineOptions({
  name: 'SelectInput'
})

withDefaults(defineProps<{
  variant?: 'primary' | 'accent' | 'hover'
  disable?: boolean
  options?: Option[]
  placeholder?: string
}>(), {
  variant: 'primary',
  disable: false,
  options: () => [],
  placeholder: '请选择'
})

const modelValue = defineModel<string | number>()
</script>


<template>
  <select
    v-model="modelValue"
    :disabled="disable"
    :class="{
      'bg-primary hover:bg-hover hover:border-hover': variant === 'primary',
      'bg-accent hover:bg-accent-hover border-accent': variant === 'accent',
      'bg-hover hover:border-hover': variant === 'hover',
      'text-sub cursor-not-allowed': disable,
    }"
    class="text-primary border border-primary rounded-md p-1 w-full cursor-pointer transition-all duration-300 outline-none"
  >
    <option
      value=""
      disabled
      selected
      hidden
    >
      {{ placeholder }}
    </option>
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>

