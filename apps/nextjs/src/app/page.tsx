import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { captureException, startSpan } from "@sentry/nextjs";

import { SESSION_COOKIE } from "@acme/core/config";
import {
  AuthenticationError,
  UnauthenticatedError,
} from "@acme/core/entities/errors/auth";
import { getTodosForUserController } from "@acme/core/interface-adapters/controllers/todos/get-todos-for-user.controller";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import { Separator } from "@acme/ui/separator";

import { UserMenu } from "./_components/user-menu";
import { CreateTodo } from "./add-todo";
import { Todos } from "./todos";

async function getTodos(sessionId: string | undefined) {
  return await startSpan(
    {
      name: "getTodos",
      op: "function.nextjs",
    },
    async () => {
      try {
        return await getTodosForUserController(sessionId);
      } catch (err) {
        if (
          err instanceof UnauthenticatedError ||
          err instanceof AuthenticationError
        ) {
          redirect("/sign-in");
        }
        captureException(err);
        throw err;
      }
    },
  );
}

export default async function Home() {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;

  const todos = await getTodos(sessionId);

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="flex flex-row items-center">
        <CardTitle className="flex-1">TODOs</CardTitle>
        <UserMenu />
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4 p-6">
        <CreateTodo />
        <Todos todos={todos} />
      </CardContent>
    </Card>
  );
}
