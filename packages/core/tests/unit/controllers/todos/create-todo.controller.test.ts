import "reflect-metadata";

import { afterEach, beforeEach, expect, it } from "vitest";

import { signInUseCase } from "#use-cases/auth/sign-in.use-case";
import { destroyContainer, initializeContainer } from "#di/container";
import { UnauthenticatedError } from "#entities/errors/auth";
import { InputParseError } from "#entities/errors/common";
import { createTodoController } from "#controllers/todos/create-todo.controller";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("creates todo", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  await expect(
    createTodoController({ todo: "Test application" }, session.id),
  ).resolves.toMatchObject({
    todo: "Test application",
    completed: false,
    userId: "1",
  });
});

it("throws for invalid input", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  await expect(createTodoController({}, session.id)).rejects.toBeInstanceOf(
    InputParseError,
  );

  await expect(
    createTodoController({ todo: "" }, session.id),
  ).rejects.toBeInstanceOf(InputParseError);
});

it("throws for unauthenticated", async () => {
  await expect(
    createTodoController({ todo: "Doesn't matter" }, undefined),
  ).rejects.toBeInstanceOf(UnauthenticatedError);
});
