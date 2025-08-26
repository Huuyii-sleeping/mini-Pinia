import { defineStore } from "../../src/pinia";
import { computed, ref } from "vue";

export default defineStore('todoList2', () => {
    const todoList = ref<any[]>([])
    const count = ref(0)
    const length = computed(() => todoList.value.length)
    const doubleCount = computed(() => count.value * 2)
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
        doubleCount, length, todoList, count, addTodo, toggleTodo, removeTodo
    }
})