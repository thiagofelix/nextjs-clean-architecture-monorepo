import { Todo, TodoInsert } from "#entities/models/todo";
import { ITodosRepository } from "#repositories/todos.repository.interface";
import { injectable } from "inversify";

@injectable()
export class MockTodosRepository implements ITodosRepository {
  private _todos: Todo[];

  constructor() {
    this._todos = [];
  }

  createTodo(todo: TodoInsert): Promise<Todo> {
    const id = this._todos.length;
    const created = { ...todo, id };
    this._todos.push(created);
    return Promise.resolve(created);
  }

  getTodo(id: number): Promise<Todo | undefined> {
    const todo = this._todos.find((t) => t.id === id);
    return Promise.resolve(todo);
  }

  getTodosForUser(userId: string): Promise<Todo[]> {
    const usersTodos = this._todos.filter((t) => t.userId === userId);
    return Promise.resolve(usersTodos);
  }

  updateTodo(id: number, input: Partial<TodoInsert>): Promise<Todo> {
    const existingIndex = this._todos.findIndex((t) => t.id === id);
    const updated = {
      ...this._todos[existingIndex],
      ...input,
    } as Todo;
    this._todos[existingIndex] = updated;
    return Promise.resolve(updated);
  }
}
