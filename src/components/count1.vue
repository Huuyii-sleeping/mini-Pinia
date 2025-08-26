<template>
    <div>count1</div>
    <div>{{ count1.count }}</div>
    <div>{{ count1.doubleCount }}</div>
    <button @click="change">add</button>
</template>

<script setup lang="ts">
import useCount1 from '../stores/todoList1'
const count1 = useCount1()
const change = () => {
    count1.$patch((state: any) => {
        state.count = 600
    })
    console.log(count1.count)
}
</script>

<style scoped lang="scss">
    
</style>