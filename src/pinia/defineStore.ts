import { computed, effectScope, inject, isReactive, isRef, reactive, toRefs } from "vue"
import { createState, formatArgs, isComputed, isFunction, subscription } from "./utils"
import { piniaSymbol } from "./global"
import { actionList, createDispose, createOnActions, createPatch, createReset, createSubscribe } from "./api"

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
                createOptionsStore(pinia, id, options)
            }
        }
        return pinia.store.get(id)
    }
    return useStore
}

function createApis(pinia: any, id: any, scope: any) {
    return {
        $patch: createPatch(pinia, id),
        $subscribe: createSubscribe(pinia, id, scope),
        $onAction: createOnActions(),
        $dispose: createDispose(pinia, id, scope),
    }
}

function createSetupStore(pinia: any, id: any, setup: any) {
    const setupStore = setup()
    let store
    let storeScope

    const result = pinia.scope.run(() => {
        storeScope = effectScope()
        store = reactive(createApis(pinia, id, storeScope))
        return storeScope.run(() => complierSetup(pinia, id, setupStore))
    })

    return setStore(pinia, store, id, result, setup, true)
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

function createOptionsStore(pinia: any, id: any, options: any) {
    /**
     *  options => states, getters, function
     *  */
    let store: any
    let storeScope
    const result = pinia.scope.run(() => {
        storeScope = effectScope() // 创建单独的独立作用域 隔离进行操作 并且能够单独滴停止Store的作用域
        store = reactive(createApis(pinia, id, storeScope))
        return storeScope.run(() => complierOptions(pinia, store, id, options))
    })


    return setStore(pinia, store, id, result, options.state, false)
}

function setStore(pinia: any, store: any, id: any, result: any, state: any, isSetup: any) {
    pinia.store.set(id, store)
    store.$id = id
    state && (store.$reset = createReset(store, state, isSetup))
    Object.assign(store, result)
    createState(pinia, id)
    runPlugins(pinia, store)
    
    return store
}

function runPlugins(pinia: any, store: any){
    pinia.plugins.forEach((plugin: any) => {
        const res = plugin({ store }) // have return will assgin

        if(res){
            Object.assign(store, res)
        }
    })
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
            const afterList: any = []
            const errorList: any = []
            let result

            subscription.trigger(actionList, { after, onError })

            try {
                result = actions[actionName].apply(store, arguments)
            } catch (error) {
                subscription.trigger(errorList, error)
            }

            if (result instanceof Promise) {
                return result.then(r => {
                    return subscription.trigger(afterList, r)
                }).catch(e => {
                    subscription.trigger(errorList, e)
                    return Promise.reject(e)
                })
            }
            
            subscription.trigger(afterList, result)
            return result

            function after(cb: any) {
                // subscription.add(afterList, cb)
                afterList.push(cb)
            }
            function onError(cb: any) {
                // subscription.add(errorList, cb)
                errorList.push(cb)
            }
        }
    }
    return storeActions
}
