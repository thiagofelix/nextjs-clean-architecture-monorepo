import type { Cookie } from "@acme/core/entities/models/cookie";
import type { Session } from "@acme/core/entities/models/session";
import { getInjection } from "@acme/core/di/container";
import { AuthenticationError } from "@acme/core/entities/errors/auth";
import { verify } from "@node-rs/argon2";
import { startSpan } from "@sentry/nextjs";

export function signInUseCase(input: {
  username: string;
  password: string;
}): Promise<{ session: Session; cookie: Cookie }> {
  return startSpan({ name: "signIn Use Case", op: "function" }, async () => {
    const authenticationService = getInjection("IAuthenticationService");
    const usersRepository = getInjection("IUsersRepository");

    const existingUser = await usersRepository.getUserByUsername(
      input.username,
    );

    if (!existingUser) {
      throw new AuthenticationError("User does not exist");
    }

    const validPassword = await startSpan(
      { name: "verify password hash", op: "function" },
      () =>
        verify(existingUser.password_hash, input.password, {
          memoryCost: 19456,
          timeCost: 2,
          outputLen: 32,
          parallelism: 1,
        }),
    );

    if (!validPassword) {
      throw new AuthenticationError("Incorrect username or password");
    }

    return await authenticationService.createSession(existingUser);
  });
}
