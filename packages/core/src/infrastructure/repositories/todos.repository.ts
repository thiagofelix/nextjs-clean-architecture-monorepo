import { ITodosRepository } from "#repositories/todos.repository.interface";
import { DatabaseOperationError } from "#entities/errors/common";
import { Todo, TodoInsert } from "#entities/models/todo";
import { captureException, startSpan } from "@sentry/nextjs";
import { eq } from "drizzle-orm";
import { injectable } from "inversify";

import { db } from "@acme/db";
import { todos } from "@acme/db/schema";

@injectable()
export class TodosRepository implements ITodosRepository {
  async createTodo(todo: TodoInsert): Promise<Todo> {
    return await startSpan(
      { name: "TodosRepository > createTodo" },
      async () => {
        try {
          const query = db.insert(todos).values(todo).returning();

          const [created] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "sqlite" },
            },
            () => query.execute(),
          );

          if (created) {
            return created;
          } else {
            throw new DatabaseOperationError("Cannot create todo");
          }
        } catch (err) {
          captureException(err, { data: todo });
          throw err; // TODO: convert to Entities error
        }
      },
    );
  }

  async getTodo(id: number): Promise<Todo | undefined> {
    return await startSpan({ name: "TodosRepository > getTodo" }, async () => {
      try {
        const query = db.query.todos.findFirst({
          where: eq(todos.id, id),
        });

        const todo = await startSpan(
          {
            name: query.toSQL().sql,
            op: "db.query",
            attributes: { "db.system": "sqlite" },
          },
          () => query.execute(),
        );

        return todo;
      } catch (err) {
        captureException(err);
        throw err; // TODO: convert to Entities error
      }
    });
  }

  async getTodosForUser(userId: string): Promise<Todo[]> {
    return await startSpan(
      { name: "TodosRepository > getTodosForUser" },
      async () => {
        try {
          const query = db.query.todos.findMany({
            where: eq(todos.userId, userId),
          });

          const usersTodos = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "sqlite" },
            },
            () => query.execute(),
          );
          return usersTodos;
        } catch (err) {
          captureException(err);
          throw err; // TODO: convert to Entities error
        }
      },
    );
  }

  async updateTodo(id: number, input: Partial<TodoInsert>): Promise<Todo> {
    return await startSpan(
      { name: "TodosRepository > updateTodo" },
      async () => {
        try {
          const query = db
            .update(todos)
            .set(input)
            .where(eq(todos.id, id))
            .returning();

          const [updated] = await startSpan(
            {
              name: query.toSQL().sql,
              op: "db.query",
              attributes: { "db.system": "sqlite" },
            },
            () => query.execute(),
          );

          if (!updated) {
            throw new DatabaseOperationError("Cannot update todo");
          }

          return updated;
        } catch (err) {
          captureException(err);
          throw err; // TODO: convert to Entities error
        }
      },
    );
  }
}
