import { getTodosForUserUseCase } from "@acme/core/application/use-cases/todos/get-todos-for-user.use-case";
import { getInjection } from "@acme/core/di/container";
import { UnauthenticatedError } from "@acme/core/entities/errors/auth";
import { Todo } from "@acme/core/entities/models/todo";
import { startSpan } from "@sentry/nextjs";

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
