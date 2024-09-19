import type { Cookie } from "@acme/core/entities/models/cookie";
import type { Session } from "@acme/core/entities/models/session";
import type { User } from "@acme/core/entities/models/user";

export interface IAuthenticationService {
  generateUserId(): string;
  validateSession(
    sessionId: Session["id"],
  ): Promise<{ user: User; session: Session }>;
  createSession(user: User): Promise<{ session: Session; cookie: Cookie }>;
  invalidateSession(sessionId: Session["id"]): Promise<{ blankCookie: Cookie }>;
}
