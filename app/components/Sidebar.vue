<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAngleLeft, faAngleRight, faGear, type IconDefinition } from '@fortawesome/free-solid-svg-icons'

const collapsed = defineModel<boolean>({ default: true })

const router = useRouter()

type Item = {
  name: string
  icon: IconDefinition
  link: string
}

const items: Item[] = [
  { name: 'Tasks', icon: faGear, link: '/tasks' },
]

</script>

<template>
  <div
    :class="{
      'w-14': collapsed,
      'w-80 sm:fixed md:relative': !collapsed,
    }"
    class="border-r border-primary text-primary h-full p-3 bg-primary"
  >
    <div class="size-full flex flex-col gap-2">
      <div class="size-8">
        <Button @click="collapsed = !collapsed">
          <FontAwesomeIcon
            class="size-4"
            :icon="collapsed ? faAngleRight : faAngleLeft"
          />
        </Button>
      </div>
      <div class="w-full flex flex-col gap-2">
        <div
          v-for="item in items"
          :key="item.name"
          class="w-full h-8 flex flex-row gap-2"
        >
          <Button
            class="flex flex-row gap-2 justify-start"
            @click="router.push(item.link)"
          >
            <FontAwesomeIcon
              class="size-3"
              :icon="item.icon"
            />
            <span
              v-if="!collapsed"
              class="text-sm"
            >{{ item.name }}</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
