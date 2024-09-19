"use client";

import { useCallback } from "react";
import { toast } from "sonner";

import { cn } from "@acme/ui";
import { Checkbox } from "@acme/ui/checkbox";

import { toggleTodo } from "./actions";

export function Todos({
  todos,
}: {
  todos: { id: number; todo: string; userId: string; completed: boolean }[];
}) {
  const handleToggle = useCallback(async (id: number) => {
    const res = await toggleTodo(id);
    if (res) {
      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success("Todo toggled!");
      }
    }
  }, []);

  return (
    <ul className="w-full">
      {todos.length > 0 ? (
        todos.map((todo) => (
          <li
            key={todo.id}
            className="flex w-full items-center gap-2 rounded-sm p-1 hover:bg-muted/50 active:bg-muted"
          >
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => handleToggle(todo.id)}
              id={`checkbox-${todo.id}`}
            />
            <label
              htmlFor={`checkbox-${todo.id}`}
              className={cn("flex-1 cursor-pointer", {
                "text-muted-foreground line-through": todo.completed,
              })}
            >
              {todo.todo}
            </label>
          </li>
        ))
      ) : (
        <p>No todos. Create some to get started!</p>
      )}
    </ul>
  );
}
