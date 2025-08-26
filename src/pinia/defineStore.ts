import { computed, effectScope, inject, isReactive, isRef, reactive, toRefs } from "vue"
import { formatArgs, isComputed, isFunction } from "./utils"
import { piniaSymbol } from "./global"
import { createPatch } from "./api"

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
                createOptions(pinia, id, options)
            }
        }
        return pinia.store.get(id)
    }
    return useStore
}

function createApis(pinia: any, id: any) {
    return {
        $patch: createPatch(pinia, id)
    }
}

function createSetupStore(pinia: any, id: any, setup: any) {
    const setupStore = setup()
    const store = reactive(createApis(pinia, id))

    let storeScope
    const result = pinia.scope.run(() => {
        storeScope = effectScope()
        return storeScope.run(() => complierSetup(pinia, id, setupStore))
    })

    return setStore(pinia, store, id, result)
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

function createOptions(pinia: any, id: any, options: any) {
    /**
     *  options => states, getters, function
     *  */
    const store = reactive(createApis(pinia, id))
    let storeScope
    const result = pinia.scope.run(() => {
        storeScope = effectScope() // 创建单独的独立作用域 隔离进行操作 并且能够单独滴停止Store的作用域
        return storeScope.run(() => complierOptions(pinia, store, id, options))
    })


    return setStore(pinia, store, id, result)
}

function setStore(pinia: any, store: any, id: any, result: any) {
    pinia.store.set(id, store)
    store.$id = id
    Object.assign(store, result)
    return store
}

function complierOptions(pinia: any, store: any, id: any, options: any) {
    const { state, getters, actions } = options
    const storeState = createStoreState(pinia, id, state)
    const storeGetters = createStoreGetters(store, getters)
    const storeActions = createStoreActions(store, actions)

    return {
        ...storeState, ...storeGetters, ...storeActions
    }
}

function createStoreState(pinia: any, id: any, state: any) {
    pinia.state.value[id] = state ? state() : {}
    /**
     *  对对象进行包装
     */
    return toRefs(pinia.state.value[id])
}

function createStoreGetters(store: any, getters: any) {
    /**
     *  getters: {
     *      count(){
     *          return this.todoList.length
     *      }
     * }
     * 
     * result : {
     *      count: computed(() => getters[getterName].call(store))
     *      key: computed(() => val.call(store))
     * }
     */
    return Object.keys(getters || {}).reduce((wrapper: any, getterName: any) => {
        wrapper[getterName] = computed(() => getters[getterName].call(store))
        return wrapper
    }, {})
}

function createStoreActions(store: any, actions: any) {
    const storeActions: any = {}
    for (const actionName in actions) {
        storeActions[actionName] = function () {
            actions[actionName].apply(store, arguments)
        }
    }
    return storeActions
}
