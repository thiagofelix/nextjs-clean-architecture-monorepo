import "reflect-metadata";

import { destroyContainer, initializeContainer } from "#di/container";
import { AuthenticationError } from "#entities/errors/auth";
import { signInUseCase } from "#use-cases/auth/sign-in.use-case";
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
  const result = await signInUseCase({
    username: "one",
    password: "password-one",
  });
  expect(result).toHaveProperty("session");
  expect(result).toHaveProperty("cookie");
  expect(result.session.userId).toBe("1");
});

it("throws for invalid input", async () => {
  await expect(() =>
    signInUseCase({ username: "non-existing", password: "doesntmatter" }),
  ).rejects.toBeInstanceOf(AuthenticationError);

  await expect(() =>
    signInUseCase({ username: "one", password: "password-two" }),
  ).rejects.toBeInstanceOf(AuthenticationError);
});
