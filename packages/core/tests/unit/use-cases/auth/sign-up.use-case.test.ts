import "reflect-metadata";

import { destroyContainer, initializeContainer } from "#di/container";
import { AuthenticationError } from "#entities/errors/auth";
import { signUpUseCase } from "#use-cases/auth/sign-up.use-case";
import { afterEach, beforeEach, expect, it } from "vitest";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("returns session and cookie", async () => {
  const result = await signUpUseCase({
    username: "new",
    password: "password-new",
  });
  expect(result).toHaveProperty("session");
  expect(result).toHaveProperty("cookie");
  expect(result).toHaveProperty("user");
});

it("throws for invalid input", async () => {
  await expect(() =>
    signUpUseCase({ username: "one", password: "doesntmatter" }),
  ).rejects.toBeInstanceOf(AuthenticationError);
});
