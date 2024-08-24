import './assets/scss/global.scss'

import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

createApp(App)
  .use(vuetify)
  .mount('#app')
