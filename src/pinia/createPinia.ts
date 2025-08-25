import { effectScope, ref } from "vue"
import { piniaSymbol } from "./global"

export function createPinia() {

    const store = new Map()
    const scope = effectScope(true)
    const state = scope.run(() => { // stop
        return ref({})
    })

    return {
        store,
        scope, // use to stop effect
        state,
        install
    }
}

function install(app: any) {
    // @ts-ignore
    app.provide(piniaSymbol, this)
}