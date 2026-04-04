import { createApp } from 'vue'
import App from './App.vue'
import router from './frontend/router/index.js'
import './frontend/assets/main.css'
import 'animate.css';

createApp(App)
  .use(router)
  .mount('#app')