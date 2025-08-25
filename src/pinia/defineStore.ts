import { effectScope, inject, isReactive, isRef, reactive } from "vue"
import { formatArgs, isComputed, isFunction } from "./utils"
import { piniaSymbol } from "./global"

export function defineStore(...args: any[]) { // return function
    const { id, options, setup } = formatArgs(args)
    const isSetup = isFunction(setup)
    function useStore() {
        // 拿到对应的数据的集合
        const pinia: any = inject(piniaSymbol)
        /**
         *  map --> 
         *  todoList1 => store
         *  todoList2 => store
         */
        if (!pinia.store.has(id)) {
            if (isSetup) {
                createSetupStore(pinia, id, setup)
            } else {
                createOptions()
            }
        }
        return pinia.store.get(id)
    }
    return useStore
}

function createSetupStore(pinia: any, id: any, setup: any) {
    const setupStore = setup()
    const store = reactive({})

    let storeScope
    const result = pinia.scope.run(() => {
        storeScope = effectScope()
        return storeScope.run(() => complierSetup(pinia, id, setupStore))
    })

    pinia.store.set(id, store)
    Object.assign(store, result)
    return store
}

function complierSetup(pinia: any, id: any, setupStore: any) {
    !pinia.state.value[id] && (pinia.state.value[id] = {})
    for (const key in setupStore) {
        const el = setupStore[key]

        if ((isRef(el) && !isComputed(el)) || isReactive(el)) {
            pinia.state.value[id][key] = el
        }
    }
    return {
        ...setupStore
    }
}

function createOptions() {

}