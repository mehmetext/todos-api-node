import todos from "@/lib/static/todos";

export default class TodosController {
  static async getTodos() {
    return todos;
  }

  static async getTodoById(id: string) {
    return todos.find((todo) => todo.id === id);
  }
}
