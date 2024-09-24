import "reflect-metadata";

import { env } from "#config";
import { signInController } from "#controllers/auth/sign-in.controller";
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
it("signs in with valid input", async () => {
  await expect(
    signInController({ username: "one", password: "password-one" }),
  ).resolves.toMatchObject({
    name: env.SESSION_COOKIE,
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
