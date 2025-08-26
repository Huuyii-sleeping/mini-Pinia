<template>
    <input type="text" v-model="addTodothing">
    <button @click="add(addTodothing)">add</button>
    <div v-for="todo in usetodoList.todoList">
        {{ todo.todo }}
    </div>
    <input type="text" v-model="removeId">
    <button @click="remove(removeId)">delete</button>
    <hr>
    <count1></count1>
    <hr>
    <count2></count2>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import count1 from './components/count1.vue'
import count2 from './components/count2.vue'
import todoListStore from './stores/todoList1';
const usetodoList = todoListStore()
const addTodothing = ref('')
const removeId = ref('')
const add = (todoing: any) => {
    const todoThing: any = {
        id: new Date().getTime(),
        todo: todoing
    }
    usetodoList.addTodo(todoThing)
    addTodothing.value = ''
}
const remove = (removeId: any) => {
    usetodoList.removeTodo(removeId)
}


</script>

<style scoped lang="scss"></style>