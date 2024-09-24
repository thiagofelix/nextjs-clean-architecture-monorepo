import "reflect-metadata";

import { destroyContainer, initializeContainer } from "#di/container";
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
it("creates todo", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  await expect(
    createTodoUseCase({ todo: "Write unit tests" }, session.userId),
  ).resolves.toMatchObject({
    todo: "Write unit tests",
    userId: "1",
    completed: false,
  });
});
