import "reflect-metadata";

import { afterEach, beforeEach, expect, it } from "vitest";

import { SESSION_COOKIE } from "@acme/core/config";
import { destroyContainer, initializeContainer } from "@acme/core/di/container";
import { AuthenticationError } from "@acme/core/entities/errors/auth";
import { InputParseError } from "@acme/core/entities/errors/common";
import { signUpController } from "@acme/core/interface-adapters/controllers/auth/sign-up.controller";

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
    name: SESSION_COOKIE,
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
