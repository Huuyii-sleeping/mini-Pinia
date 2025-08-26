import { isFunction, mergeObject } from "./utils"

export function createPatch(pinia: any, id: any){
    return function $patch(stateOrFn: any){
        if(isFunction(stateOrFn)){
            stateOrFn(pinia.state.value[id])
        } else {
            mergeObject(pinia.state.value[id], stateOrFn)
        }
    }
}