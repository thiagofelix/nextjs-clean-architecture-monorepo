import "reflect-metadata";

import { afterEach, beforeEach, expect, it } from "vitest";

import { signInUseCase } from "#use-cases/auth/sign-in.use-case";
import { signOutUseCase } from "#use-cases/auth/sign-out.use-case";
import { createTodoUseCase } from "#use-cases/todos/create-todo.use-case";
import { destroyContainer, initializeContainer } from "#di/container";
import {
  UnauthenticatedError,
  UnauthorizedError,
} from "#entities/errors/auth";
import { InputParseError } from "#entities/errors/common";
import { toggleTodoController } from "#controllers/todos/toggle-todo.controller";

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

  expect(todo.completed).toBe(false);

  await expect(
    toggleTodoController({ todoId: todo.id }, session.id),
  ).resolves.toMatchObject({
    todo: "Write unit tests",
    completed: true,
    userId: "1",
  });

  await expect(
    toggleTodoController({ todoId: todo.id }, session.id),
  ).resolves.toMatchObject({
    todo: "Write unit tests",
    completed: false,
    userId: "1",
  });
});

it("throws for invalid input", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  await expect(
    // @ts-expect-error Testing invalid input
    toggleTodoController(undefined, session.id),
  ).rejects.toBeInstanceOf(InputParseError);
  await expect(toggleTodoController({}, session.id)).rejects.toBeInstanceOf(
    InputParseError,
  );
});

it("throws when unauthenticated", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  const todo = await createTodoUseCase(
    { todo: "Write unit tests" },
    session.userId,
  );

  await signOutUseCase(session.id);

  // with valid session id, but expired session
  await expect(
    toggleTodoController({ todoId: todo.id }, session.id),
  ).rejects.toBeInstanceOf(UnauthenticatedError);

  // with undefined session id
  await expect(
    toggleTodoController({ todoId: todo.id }, undefined),
  ).rejects.toBeInstanceOf(UnauthenticatedError);
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
    toggleTodoController({ todoId: todo.id }, sessionTwo.id),
  ).rejects.toBeInstanceOf(UnauthorizedError);
});
