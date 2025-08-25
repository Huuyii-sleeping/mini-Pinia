import { defineStore } from "../../src/pinia";

export default defineStore('todoList1', {
    state: () => ({
        todoList: [] as any
    }),
    // computed
    getters: {
        count(): any {
            return this.todoList.length
        }
    },
    actions: {
        addTodo(todo: any) {
            this.todoList.unshift(todo)
        },
        toggleTodo(id: any) {
            this.todoList = this.todoList.map((todo: any) => {
                if (todo.id === id) {
                    todo.completed = !todo.completed
                }
            })
        },
        removeTodo(id: any) {
            this.todoList = this.todoList.filter((todo: any) => todo.id !== id)
        }
    }
})