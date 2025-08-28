import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
// import { createPinia } from '../src/pinia'

const pinia = createPinia()
console.log(pinia)

// use 可以有多个
pinia.use(function ({ store }) {
    const localState = JSON.parse(localStorage.getItem('PINIA_STATE' + store.id) || `{
        "count": 0,
        "todoList": [],
    }`)

    store.$state = localState

    /**
     *  自动的将Pinia Store的状态保存到localStore当中，实现页面的刷新后状态不丢失，同时监控Action的调用
     */
    store.$subscribe(({ storeId }, state) => {
        localStorage.setItem('PINIA_STATE' + storeId, JSON.stringify(state))
    })

    store.$onAction(() => {
        console.log('action 调用')
    })
})


const app = createApp(App)

app.use(pinia)
app.mount('#app')
