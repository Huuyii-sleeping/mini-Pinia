import { isRef } from "vue"

export function formatArgs(args: any[]) {
    let id
    let options
    let setup

    if (isString(args[0])) {
        id = args[0]
        if (isFunction(args[1])) {
            setup = args[1]
        } else {
            options = args[1]
        }
    } else {
        options = args[0]
        id = args[0].id
    }

    return {
        id, options, setup
    }
}

export function isString(val: any) {
    return typeof val === 'string'
}

export function isFunction(val: any) {
    return typeof val === 'function'
}

export function isComputed(val: any) {
    //@ts-ignore
    return !!(isRef(val) && val.effect)
}

export function isObject(val: any) {
    return typeof val === 'object' && val !== null
}

export function mergeObject(targetState: any, newState: any) {
    for (let k in newState) {
        const oldVal = targetState[k]
        const newVal = newState[k]
        if (isObject(newVal) && isObject(oldVal)) {
            targetState[k] = mergeObject(oldVal, newVal)
        } else {
            targetState[k] = newVal
        }
    }
    return targetState
}

// 添加订阅和发布订阅
export const subscription = {
    add(list: any, cb: any){
        list.push(cb)
    },
    trigger(list: any, ...args: any){
        list.forEach((cb: any) => cb(...args));
    }
}

export function createState(pinia: any,id: any){
    const store = pinia.store.get(id)
    Object.defineProperty(store, '$state',{
        get: () => pinia.state.value[id],
        set: (newState) => store.$patch((state: any) => Object.assign(state, newState))
    })
}