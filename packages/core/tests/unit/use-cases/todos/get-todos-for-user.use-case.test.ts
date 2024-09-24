import "reflect-metadata";

import { afterEach, beforeEach, expect, it } from "vitest";

import { signInUseCase } from "#use-cases/auth/sign-in.use-case";
import { createTodoUseCase } from "#use-cases/todos/create-todo.use-case";
import { getTodosForUserUseCase } from "#use-cases/todos/get-todos-for-user.use-case";
import { destroyContainer, initializeContainer } from "#di/container";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("returns todos", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });
  await expect(getTodosForUserUseCase(session.userId)).resolves.toHaveLength(0);

  await createTodoUseCase({ todo: "todo-one" }, session.userId);
  await createTodoUseCase({ todo: "todo-two" }, session.userId);
  await createTodoUseCase({ todo: "todo-three" }, session.userId);

  await expect(getTodosForUserUseCase(session.userId)).resolves.toMatchObject([
    {
      todo: "todo-one",
      userId: "1",
      completed: false,
    },
    {
      todo: "todo-two",
      userId: "1",
      completed: false,
    },
    {
      todo: "todo-three",
      userId: "1",
      completed: false,
    },
  ]);
});
