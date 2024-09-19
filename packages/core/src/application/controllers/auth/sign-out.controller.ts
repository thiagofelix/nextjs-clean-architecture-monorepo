import { signOutUseCase } from "@acme/core/application/use-cases/auth/sign-out.use-case";
import { getInjection } from "@acme/core/di/container";
import { InputParseError } from "@acme/core/entities/errors/common";
import type { Cookie } from "@acme/core/entities/models/cookie";
import { startSpan } from "@sentry/nextjs";

export async function signOutController(
  sessionId: string | undefined,
): Promise<Cookie> {
  return await startSpan({ name: "signOut Controller" }, async () => {
    if (!sessionId) {
      throw new InputParseError("Must provide a session ID");
    }
    const authenticationService = getInjection("IAuthenticationService");
    const { session } = await authenticationService.validateSession(sessionId);

    const { blankCookie } = await signOutUseCase(session.id);
    return blankCookie;
  });
}
