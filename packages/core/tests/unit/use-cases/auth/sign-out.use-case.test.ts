import "reflect-metadata";

import { env } from "#config";
import { destroyContainer, initializeContainer } from "#di/container";
import { signInUseCase } from "#use-cases/auth/sign-in.use-case";
import { signOutUseCase } from "#use-cases/auth/sign-out.use-case";
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

  await expect(signOutUseCase(session.id)).resolves.toMatchObject({
    blankCookie: {
      name: env.SESSION_COOKIE,
      value: "",
      attributes: {},
    },
  });
});
