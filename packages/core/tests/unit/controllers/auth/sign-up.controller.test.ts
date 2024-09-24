import "reflect-metadata";

import { env } from "#env";
import { signUpController } from "#controllers/auth/sign-up.controller";
import { destroyContainer, initializeContainer } from "#di/container";
import { AuthenticationError } from "#entities/errors/auth";
import { InputParseError } from "#entities/errors/common";
import { afterEach, beforeEach, expect, it } from "vitest";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("returns cookie", async () => {
  const { cookie, user } = await signUpController({
    username: "nikolovlazar",
    password: "password",
    confirm_password: "password",
  });

  expect(user).toBeDefined();
  expect(cookie).toMatchObject({
    name: env.SESSION_COOKIE,
    value: `random_session_id_${user.id}`,
    attributes: {},
  });
});

it("throws for invalid input", async () => {
  // empty object
  await expect(signUpController({})).rejects.toBeInstanceOf(InputParseError);

  // below min length
  await expect(
    signUpController({
      username: "no",
      password: "no",
      confirm_password: "nah",
    }),
  ).rejects.toBeInstanceOf(InputParseError);

  // wrong passwords
  await expect(
    signUpController({
      username: "nikolovlazar",
      password: "password",
      confirm_password: "passwords",
    }),
  ).rejects.toBeInstanceOf(InputParseError);
});

it("throws for existing username", async () => {
  await expect(
    signUpController({
      username: "one",
      password: "doesntmatter",
      confirm_password: "doesntmatter",
    }),
  ).rejects.toBeInstanceOf(AuthenticationError);
});
