import "reflect-metadata";

import { afterEach, beforeEach, expect, it } from "vitest";

import { SESSION_COOKIE } from "@acme/core/config";
import { destroyContainer, initializeContainer } from "@acme/core/di/container";
import { AuthenticationError } from "@acme/core/entities/errors/auth";
import { InputParseError } from "@acme/core/entities/errors/common";
import { signInController } from "@acme/core/application/controllers/auth/sign-in.controller";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("signs in with valid input", async () => {
  await expect(
    signInController({ username: "one", password: "password-one" }),
  ).resolves.toMatchObject({
    name: SESSION_COOKIE,
    value: "random_session_id_1",
    attributes: {},
  });
});

it("throws for invalid input", async () => {
  await expect(signInController({ username: "" })).rejects.toBeInstanceOf(
    InputParseError,
  );
  await expect(signInController({ password: "" })).rejects.toBeInstanceOf(
    InputParseError,
  );
  await expect(signInController({ username: "no" })).rejects.toBeInstanceOf(
    InputParseError,
  );
  await expect(signInController({ password: "no" })).rejects.toBeInstanceOf(
    InputParseError,
  );
  await expect(
    signInController({ username: "one", password: "short" }),
  ).rejects.toBeInstanceOf(InputParseError);
  await expect(
    signInController({
      username: "oneverylongusernamethatmakesnosense",
      password: "short",
    }),
  ).rejects.toBeInstanceOf(InputParseError);
  await expect(
    signInController({
      username: "one",
      password: "oneverylongpasswordthatmakesnosense",
    }),
  ).rejects.toBeInstanceOf(InputParseError);
  await expect(
    signInController({
      username: "oneverylongusernamethatmakesnosense",
      password: "oneverylongpasswordthatmakesnosense",
    }),
  ).rejects.toBeInstanceOf(InputParseError);
});

it("throws for invalid credentials", async () => {
  await expect(
    signInController({ username: "nonexisting", password: "doesntmatter" }),
  ).rejects.toBeInstanceOf(AuthenticationError);
  await expect(
    signInController({ username: "one", password: "wrongpass" }),
  ).rejects.toBeInstanceOf(AuthenticationError);
});
