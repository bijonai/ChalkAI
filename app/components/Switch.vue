<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'accent' | 'hover'
  disabled?: boolean
  checked?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
  checked: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:checked': [value: boolean]
  'change': [value: boolean]
}>()

const handleClick = () => {
  if (props.disabled) return
  
  const newValue = !props.checked
  emit('update:checked', newValue)
  emit('change', newValue)
}

const sizeClasses = {
  sm: 'w-8 h-5',
  md: 'w-10 h-6',
  lg: 'w-12 h-7'
}

const thumbSizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5'
}

const thumbPositionClasses = computed(() => ({
  sm: props.checked ? 'translate-x-3' : 'translate-x-0.5',
  md: props.checked ? 'translate-x-4' : 'translate-x-0.5',
  lg: props.checked ? 'translate-x-5' : 'translate-x-0.5'
}))
</script>

<template>
  <div 
    :class="[
      sizeClasses[size],
      {
        'bg-primary': variant === 'primary' && checked,
        'bg-accent': variant === 'accent' && checked,
        'bg-hover': variant === 'hover' && checked,
        'bg-gray-300': !checked,
        'opacity-50 cursor-not-allowed': disabled,
        'cursor-pointer': !disabled
      }
    ]"
    class="relative flex items-center justify-center rounded-full border transition-all duration-300 ease-in-out"
    @click="handleClick"
  >
    <div 
      :class="[
        thumbSizeClasses[size],
        thumbPositionClasses[size],
        {
          'bg-white': !disabled,
          'bg-gray-100': disabled
        }
      ]"
      class="absolute top-0.5 left-0.5 rounded-full shadow-sm transition-transform duration-300 ease-in-out"
    />
  </div>
</template>
