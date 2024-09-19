import "reflect-metadata";

import { afterEach, beforeEach, expect, it } from "vitest";

import { signInUseCase } from "@acme/core/use-cases/auth/sign-in.use-case";
import { signOutUseCase } from "@acme/core/use-cases/auth/sign-out.use-case";
import { createTodoUseCase } from "@acme/core/use-cases/todos/create-todo.use-case";
import { toggleTodoUseCase } from "@acme/core/use-cases/todos/toggle-todo.use-case";
import { destroyContainer, initializeContainer } from "@acme/core/di/container";
import { UnauthorizedError } from "@acme/core/entities/errors/auth";
import { NotFoundError } from "@acme/core/entities/errors/common";

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
