"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";

import { createTodo } from "./actions";

export function CreateTodo() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const res = await createTodo(formData);

    if (res.error) {
      toast.error(res.error);
    } else if (res.success) {
      toast.success("Todo created!");

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <Input
        ref={inputRef}
        name="todo"
        className="flex-1"
        placeholder="Take out trash"
      />
      <Button size="icon" type="submit">
        <Plus />
      </Button>
    </form>
  );
}
