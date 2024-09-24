import "reflect-metadata";

import { getTodosForUserController } from "#controllers/todos/get-todos-for-user.controller";
import { destroyContainer, initializeContainer } from "#di/container";
import { UnauthenticatedError } from "#entities/errors/auth";
import { signInUseCase } from "#use-cases/auth/sign-in.use-case";
import { createTodoUseCase } from "#use-cases/todos/create-todo.use-case";
import { afterEach, beforeEach, expect, it } from "vitest";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("returns users todos", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  await expect(getTodosForUserController(session.id)).resolves.toMatchObject(
    [],
  );

  await createTodoUseCase({ todo: "todo-one" }, session.userId);
  await createTodoUseCase({ todo: "todo-two" }, session.userId);
  await createTodoUseCase({ todo: "todo-three" }, session.userId);

  await expect(getTodosForUserController(session.id)).resolves.toMatchObject([
    {
      todo: "todo-one",
      completed: false,
      userId: "1",
    },
    {
      todo: "todo-two",
      completed: false,
      userId: "1",
    },
    {
      todo: "todo-three",
      completed: false,
      userId: "1",
    },
  ]);
});

it("throws when unauthenticated", async () => {
  await expect(getTodosForUserController("")).rejects.toBeInstanceOf(
    UnauthenticatedError,
  );
  await expect(getTodosForUserController(undefined)).rejects.toBeInstanceOf(
    UnauthenticatedError,
  );
});
