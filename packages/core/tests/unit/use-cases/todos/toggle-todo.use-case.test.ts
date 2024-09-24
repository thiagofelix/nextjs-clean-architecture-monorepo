import "reflect-metadata";

import { destroyContainer, initializeContainer } from "#di/container";
import { UnauthorizedError } from "#entities/errors/auth";
import { NotFoundError } from "#entities/errors/common";
import { signInUseCase } from "#use-cases/auth/sign-in.use-case";
import { signOutUseCase } from "#use-cases/auth/sign-out.use-case";
import { createTodoUseCase } from "#use-cases/todos/create-todo.use-case";
import { toggleTodoUseCase } from "#use-cases/todos/toggle-todo.use-case";
import { afterEach, beforeEach, expect, it } from "vitest";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("toggles todo", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  const todo = await createTodoUseCase(
    { todo: "Write unit tests" },
    session.userId,
  );

  await expect(
    toggleTodoUseCase({ todoId: todo.id }, session.userId),
  ).resolves.toMatchObject({
    todo: "Write unit tests",
    userId: "1",
    completed: true,
  });
});

it("throws when unauthorized", async () => {
  const { session: sessionOne } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  const todo = await createTodoUseCase(
    { todo: "Write unit tests" },
    sessionOne.userId,
  );

  await signOutUseCase(sessionOne.id);

  const { session: sessionTwo } = await signInUseCase({
    username: "two",
    password: "password-two",
  });

  await expect(
    toggleTodoUseCase({ todoId: todo.id }, sessionTwo.userId),
  ).rejects.toBeInstanceOf(UnauthorizedError);
});

it("throws for invalid input", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  await expect(
    toggleTodoUseCase({ todoId: 1234567890 }, session.userId),
  ).rejects.toBeInstanceOf(NotFoundError);
});
