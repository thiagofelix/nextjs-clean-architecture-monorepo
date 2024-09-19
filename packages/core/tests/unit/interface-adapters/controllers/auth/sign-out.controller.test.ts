import "reflect-metadata";

import { signInUseCase } from "@acme/core/application/use-cases/auth/sign-in.use-case";
import { SESSION_COOKIE } from "@acme/core/config";
import { destroyContainer, initializeContainer } from "@acme/core/di/container";
import { InputParseError } from "@acme/core/entities/errors/common";
import { signOutController } from "@acme/core/interface-adapters/controllers/auth/sign-out.controller";
import { afterEach, beforeEach, expect, it } from "vitest";

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

  expect(signOutController(session.id)).resolves.toMatchObject({
    name: SESSION_COOKIE,
    value: "",
    attributes: {},
  });
});

it("throws for invalid input", () => {
  expect(signOutController(undefined)).rejects.toBeInstanceOf(InputParseError);
});
