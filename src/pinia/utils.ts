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
        id,options,setup
    }
}

export function isString(val: any) {
    return typeof val === 'string'
}

export function isFunction(val: any) {
    return typeof val === 'function'
}

export function isComputed(val: any){
    //@ts-ignore
    return !!(isRef(val) && val.effect)
}