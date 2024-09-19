import type { Todo } from "@acme/core/entities/models/todo";
import { getInjection } from "@acme/core/di/container";
import { startSpan } from "@sentry/nextjs";

export function getTodosForUserUseCase(userId: string): Promise<Todo[]> {
  return startSpan(
    { name: "getTodosForUser UseCase", op: "function" },
    async () => {
      const todosRepository = getInjection("ITodosRepository");

      return await todosRepository.getTodosForUser(userId);
    },
  );
}
