import "reflect-metadata";

import { signUpUseCase } from "@acme/core/application/use-cases/auth/sign-up.use-case";
import { destroyContainer, initializeContainer } from "@acme/core/di/container";
import { AuthenticationError } from "@acme/core/entities/errors/auth";
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

it("throws for invalid input", () => {
  expect(() =>
    signUpUseCase({ username: "one", password: "doesntmatter" }),
  ).rejects.toBeInstanceOf(AuthenticationError);
});
