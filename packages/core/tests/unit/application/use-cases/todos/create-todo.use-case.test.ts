import "reflect-metadata";

import { signInUseCase } from "@acme/core/application/use-cases/auth/sign-in.use-case";
import { createTodoUseCase } from "@acme/core/application/use-cases/todos/create-todo.use-case";
import { destroyContainer, initializeContainer } from "@acme/core/di/container";
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
    createTodoUseCase({ todo: "Write unit tests" }, session.userId),
  ).resolves.toMatchObject({
    todo: "Write unit tests",
    userId: "1",
    completed: false,
  });
});
