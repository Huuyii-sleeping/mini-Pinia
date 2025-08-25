import { computed } from "vue";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCounterStore = defineStore('counter',() => {
    const count = ref(10)
    const doubleCount = computed(() => count.value*2)
    const add = () => {
        count.value ++
    }
    return {
        doubleCount,
        count,
        add
    }
})