import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'virtual:uno.css'
import router from './router'
import '@chalk-dsl/theme-default/styles/main.css'
import '@chalk-dsl/form'
import '@chalk-dsl/widget'
import '@chalk-dsl/canvas'
import '@chalk-dsl/math'
import { block } from '@chalk-dsl/layout'
import { registerPrefab } from '@chalk-dsl/renderer-core'

registerPrefab('block', block)


createApp(App).use(router).mount('#app')
