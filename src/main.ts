import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// import { createPinia } from 'pinia'
import { createPinia } from '../src/pinia'

const pinia = createPinia()
console.log(pinia)
const app = createApp(App)
app.use(pinia)
app.mount('#app')
