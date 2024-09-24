import "reflect-metadata";

import { afterEach, beforeEach, expect, it } from "vitest";

import { signInUseCase } from "#use-cases/auth/sign-in.use-case";
import { SESSION_COOKIE } from "#config";
import { destroyContainer, initializeContainer } from "#di/container";
import { InputParseError } from "#entities/errors/common";
import { signOutController } from "#controllers/auth/sign-out.controller";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("returns blank cookie", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  await expect(signOutController(session.id)).resolves.toMatchObject({
    name: SESSION_COOKIE,
    value: "",
    attributes: {},
  });
});

it("throws for invalid input", async () => {
  await expect(signOutController(undefined)).rejects.toBeInstanceOf(
    InputParseError,
  );
});
