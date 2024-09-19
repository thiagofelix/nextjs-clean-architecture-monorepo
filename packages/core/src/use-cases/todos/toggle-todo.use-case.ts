import type { Todo } from "@acme/core/entities/models/todo";
import { getInjection } from "@acme/core/di/container";
import { UnauthorizedError } from "@acme/core/entities/errors/auth";
import { NotFoundError } from "@acme/core/entities/errors/common";
import { startSpan } from "@sentry/nextjs";

export function toggleTodoUseCase(
  input: {
    todoId: number;
  },
  userId: string,
): Promise<Todo> {
  return startSpan(
    { name: "toggleTodo Use Case", op: "function" },
    async () => {
      const todosRepository = getInjection("ITodosRepository");

      const todo = await todosRepository.getTodo(input.todoId);

      if (!todo) {
        throw new NotFoundError("Todo does not exist");
      }

      if (todo.userId !== userId) {
        throw new UnauthorizedError("Cannot toggle todo. Reason: unauthorized");
      }

      const updatedTodo = await todosRepository.updateTodo(todo.id, {
        completed: !todo.completed,
      });

      return updatedTodo;
    },
  );
}
