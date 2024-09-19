import { getInjection } from "@acme/core/di/container";
import { Cookie } from "@acme/core/entities/models/cookie";
import { startSpan } from "@sentry/nextjs";

export function signOutUseCase(
  sessionId: string,
): Promise<{ blankCookie: Cookie }> {
  return startSpan({ name: "signOut Use Case", op: "function" }, async () => {
    const authenticationService = getInjection("IAuthenticationService");

    return await authenticationService.invalidateSession(sessionId);
  });
}
