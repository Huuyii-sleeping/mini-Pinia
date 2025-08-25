<template>
    <input type="text" v-model="addTodothing">
    <button @click="add(addTodothing)">add</button>
    <div v-for="todo in usetodoList.todoList">
        {{ todo.todo }}
    </div>
    <input type="text" v-model="removeId">
    <button @click="remove(removeId)">delete</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import todoListStore from './stores/todoList2';
const usetodoList = todoListStore()
console.log(usetodoList)
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