import { defineStore } from "../../src/pinia";
import { computed, ref } from "vue";

export default defineStore('todoList2', () => {
    const todoList = ref<any[]>([])
    const count = computed(() => todoList.value.length)

    const addTodo = (todo: any) => {
        todoList.value.unshift(todo)
    }
    const toggleTodo = (id: any) => {
        todoList.value = todoList.value.map((todo: any) => {
            if (todo.id === id) {
                todo.completed = !todo.completed
            }
        })
    }
    const removeTodo = (id: any) => {
        todoList.value = todoList.value.filter((todo: any) => todo.id !== id)
    }
    return {
        todoList, count, addTodo, toggleTodo, removeTodo
    }
})