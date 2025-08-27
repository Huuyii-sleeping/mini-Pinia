import { isRef, watch } from "vue"
import { isComputed, isFunction, mergeObject, subscription } from "./utils"

export let actionList: any = []

export function createPatch(pinia: any, id: any) {
    return function $patch(stateOrFn: any) {
        if (isFunction(stateOrFn)) {
            stateOrFn(pinia.state.value[id])
        } else {
            mergeObject(pinia.state.value[id], stateOrFn)
        }
    }
}

export function createReset(store: any, stateFn: any, isSetup: any) {
    return function $reset() {
        const initalState = stateFn ? stateFn() : {}
        if (isSetup) {
            const initObj: any = {}
            for (const key in initalState) {
                const el = initalState[key]
                if (!isFunction(el) && !isComputed(el)) {
                    if (isRef(el)) initObj[key] = el.value
                    else initObj[key] = el.value
                }
            }
            store.$patch((state: any) => {
                Object.assign(state, initObj)
            })
        } else {
            store.$patch((state: any) => {
                Object.assign(state, initalState)
            })
        }
    }
}

export function createSubscribe(pinia: any, id: any, scope: any) {
    return function $subscribe(callback: any, options = {}) {
        scope.run(() => {
            return watch(pinia.state.value[id], state => {
                callback({ storeId: id }, state)
            }, options)
        })
        return scope.stop
    }
}

export function createOnActions() {
    return function $onAction(cb: any) {
        subscription.add(actionList, cb)
    }
}

export function createDispose(pinia: any, id: any, scope: any){
    return function $dispose(){
        console.log(111)
        actionList = []
        pinia.store.delete(id)
        scope.stop()
    }
}