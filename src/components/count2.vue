<template>
    <div>count2</div>
    <div>{{ count2.count }}</div>
    <div>{{ count2.doubleCount }}</div>
    <button @click="change">add</button>
</template>

<script setup lang="ts">
import useCount2 from '../stores/todoList2'
const count2 = useCount2()
const change = () => {
    count2.$patch({
        count : 500
    })
}
</script>

<style scoped lang="scss">
    
</style>