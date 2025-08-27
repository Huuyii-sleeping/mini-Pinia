<template>
    <div>count1</div>
    <div>{{ count1.count }}</div>
    <div>{{ count1.doubleCount }}</div>
    <button @click="change">add</button>
    <button @click="reset">reset</button>
</template>

<script setup lang="ts">
import useCount1 from '../stores/todoList1'
const count1 = useCount1()
const change = () => {
    count1.$patch((state: any) => {
        state.count = 600
    })
}
const reset = () => {
    count1.$reset()
}
count1.$subscribe(() => {
    console.log(111)
})
</script>

<style scoped lang="scss">
    
</style>