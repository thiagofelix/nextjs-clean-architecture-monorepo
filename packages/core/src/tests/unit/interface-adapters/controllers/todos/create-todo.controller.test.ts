import "reflect-metadata";

import { signInUseCase } from "@acme/core/application/use-cases/auth/sign-in.use-case";
import { destroyContainer, initializeContainer } from "@acme/core/di/container";
import { UnauthenticatedError } from "@acme/core/entities/errors/auth";
import { InputParseError } from "@acme/core/entities/errors/common";
import { createTodoController } from "@acme/core/interface-adapters/controllers/todos/create-todo.controller";
import { afterEach, beforeEach, expect, it } from "vitest";

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

  expect(
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

  expect(createTodoController({}, session.id)).rejects.toBeInstanceOf(
    InputParseError,
  );

  expect(createTodoController({ todo: "" }, session.id)).rejects.toBeInstanceOf(
    InputParseError,
  );
});

it("throws for unauthenticated", () => {
  expect(
    createTodoController({ todo: "Doesn't matter" }, undefined),
  ).rejects.toBeInstanceOf(UnauthenticatedError);
});
