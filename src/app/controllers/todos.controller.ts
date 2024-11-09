import todos from "@/lib/static/todos";

export default class TodosController {
  static async getTodos() {
    return todos;
  }
}
