import { defineStore } from "../../src/pinia";

export default defineStore('todoList1', {
    state: () => ({
        todoList: [] as any,
        count : 0 as number
    }),
    // computed
    getters: {
        length(): any {
            return this.todoList.length
        },
        doubleCount(): any{
            return this.count * 2
        }
    },
    actions: {
        addTodo(todo: any) {
            this.todoList.unshift(todo)
            
            throw new Error('添加失败')
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