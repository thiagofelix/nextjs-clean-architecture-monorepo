import { startSpan } from "@sentry/nextjs";

import type { Todo } from "#entities/models/todo";
import { getInjection } from "#di/container";
import { UnauthenticatedError } from "#entities/errors/auth";
import { getTodosForUserUseCase } from "#use-cases/todos/get-todos-for-user.use-case";

function presenter(todos: Todo[]) {
  return startSpan({ name: "getTodosForUser Presenter", op: "serialize" }, () =>
    todos.map((t) => ({
      id: t.id,
      todo: t.todo,
      userId: t.userId,
      completed: t.completed,
    })),
  );
}

export async function getTodosForUserController(
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan({ name: "getTodosForUser Controller" }, async () => {
    if (!sessionId) {
      throw new UnauthenticatedError("Must be logged in to create a todo");
    }

    const authenticationService = getInjection("IAuthenticationService");
    const { session } = await authenticationService.validateSession(sessionId);

    const todos = await getTodosForUserUseCase(session.userId);

    return presenter(todos);
  });
}
