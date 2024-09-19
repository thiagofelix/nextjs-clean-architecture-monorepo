"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  captureException,
  withServerActionInstrumentation,
} from "@sentry/nextjs";

import type { Cookie } from "@acme/core/entities/models/cookie";
import { SESSION_COOKIE } from "@acme/core/config";
import {
  AuthenticationError,
  UnauthenticatedError,
} from "@acme/core/entities/errors/auth";
import { InputParseError } from "@acme/core/entities/errors/common";
import { signInController } from "@acme/core/controllers/auth/sign-in.controller";
import { signOutController } from "@acme/core/controllers/auth/sign-out.controller";
import { signUpController } from "@acme/core/controllers/auth/sign-up.controller";

export async function signUp(formData: FormData) {
  return await withServerActionInstrumentation(
    "signUp",
    { recordResponse: true },
    async () => {
      const username = formData.get("username")?.toString();
      const password = formData.get("password")?.toString();
      const confirmPassword = formData.get("confirm_password")?.toString();

      let sessionCookie: Cookie;
      try {
        const { cookie } = await signUpController({
          username,
          password,
          confirm_password: confirmPassword,
        });
        sessionCookie = cookie;
      } catch (err) {
        if (err instanceof InputParseError) {
          return {
            error:
              "Invalid data. Make sure the Password and Confirm Password match.",
          };
        }
        captureException(err);
        console.log(err);
        return {
          error:
            "An error happened. The developers have been notified. Please try again later. Message: " +
            (err as Error).message,
        };
      }

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      redirect("/");
    },
  );
}

export async function signIn(formData: FormData) {
  return await withServerActionInstrumentation(
    "signIn",
    { recordResponse: true },
    async () => {
      const username = formData.get("username")?.toString();
      const password = formData.get("password")?.toString();

      let sessionCookie: Cookie;
      try {
        sessionCookie = await signInController({ username, password });
      } catch (err) {
        if (
          err instanceof InputParseError ||
          err instanceof AuthenticationError
        ) {
          return {
            error: "Incorrect username or password",
          };
        }
        captureException(err);
        return {
          error:
            "An error happened. The developers have been notified. Please try again later.",
        };
      }

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      redirect("/");
    },
  );
}

export async function signOut() {
  return await withServerActionInstrumentation(
    "signOut",
    { recordResponse: true },
    async () => {
      const cookiesStore = cookies();
      const sessionId = cookiesStore.get(SESSION_COOKIE)?.value;

      let blankCookie: Cookie;
      try {
        blankCookie = await signOutController(sessionId);
      } catch (err) {
        if (
          err instanceof UnauthenticatedError ||
          err instanceof InputParseError
        ) {
          redirect("/sign-in");
        }
        captureException(err);
        throw err;
      }

      cookies().set(
        blankCookie.name,
        blankCookie.value,
        blankCookie.attributes,
      );

      redirect("/sign-in");
    },
  );
}
