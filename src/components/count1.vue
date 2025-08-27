<template>
    <div>count1</div>
    <div>{{ count1.count }}</div>
    <div>{{ count1.doubleCount }}</div>
    <button @click="change">add</button>
    <button @click="reset">reset</button>
    <button @click="dispose">dispose</button>
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
    console.log('count1改变')
})
// @ts-ignore
count1.$onAction(({ after, onError }) => {
    console.log('before:', count1.todoList)
    // callback
    after(() => {
        console.log('after', count1.todoList)
    })
    onError((err: any) => {
        console.log('error:', err)
    })
})  

// 响应式什么的都会进行销毁操作
const dispose = () => {
    count1.$dispose()
}
</script>

<style scoped lang="scss"></style>