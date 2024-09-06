import './assets/scss/global.scss'

import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import api from './plugins/api'
import { createPinia } from 'pinia'

const pinia = createPinia()

createApp(App)
  .use(vuetify)
  .use(pinia)
  .provide('api', api)
  .mount('#app')
