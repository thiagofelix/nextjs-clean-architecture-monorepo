import { startSpan } from "@sentry/nextjs";
import { z } from "zod";

import type { Todo } from "#entities/models/todo";
import { createTodoUseCase } from "#use-cases/todos/create-todo.use-case";
import { getInjection } from "#di/container";
import { UnauthenticatedError } from "#entities/errors/auth";
import { InputParseError } from "#entities/errors/common";

function presenter(todo: Todo) {
  return startSpan({ name: "createTodo Presenter", op: "serialize" }, () => {
    return {
      id: todo.id,
      todo: todo.todo,
      userId: todo.userId,
      completed: todo.completed,
    };
  });
}

const inputSchema = z.object({ todo: z.string().min(1) });

export async function createTodoController(
  input: unknown,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "createTodo Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to create a todo");
      }
      const authenticationService = getInjection("IAuthenticationService");
      const { user } = await authenticationService.validateSession(sessionId);

      const { data, error: inputParseError } = inputSchema.safeParse(input);

      if (inputParseError) {
        throw new InputParseError("Invalid data", { cause: inputParseError });
      }

      const todo = await createTodoUseCase(data, user.id);

      return presenter(todo);
    },
  );
}
