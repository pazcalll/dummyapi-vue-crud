import { createApp } from 'vue'
import App from './App.vue'

// import './assets/main.css'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import "quasar/dist/quasar.sass"
import { defineComponent } from '@vue/runtime-core'
import axios from 'axios'

createApp(App).use(Quasar, quasarUserOptions).mount('#app')
