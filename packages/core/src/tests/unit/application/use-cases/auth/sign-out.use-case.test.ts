import "reflect-metadata";

import { signInUseCase } from "@acme/core/application/use-cases/auth/sign-in.use-case";
import { signOutUseCase } from "@acme/core/application/use-cases/auth/sign-out.use-case";
import { SESSION_COOKIE } from "@acme/core/config";
import { destroyContainer, initializeContainer } from "@acme/core/di/container";
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

  expect(signOutUseCase(session.id)).resolves.toMatchObject({
    blankCookie: {
      name: SESSION_COOKIE,
      value: "",
      attributes: {},
    },
  });
});
