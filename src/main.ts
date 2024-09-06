import './assets/scss/global.scss'

import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import api from './plugins/api'

var app = createApp(App)
  .use(vuetify)
app.provide('api', api)
app.mount('#app')
