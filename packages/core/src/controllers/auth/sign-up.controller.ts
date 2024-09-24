import { signUpUseCase } from "#use-cases/auth/sign-up.use-case";
import { InputParseError } from "#entities/errors/common";
import { startSpan } from "@sentry/nextjs";
import { z } from "zod";

const inputSchema = z
  .object({
    username: z.string().min(3).max(31),
    password: z.string().min(6).max(31),
    confirm_password: z.string().min(6).max(31),
  })
  .superRefine(({ password, confirm_password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["password"],
      });
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export async function signUpController(
  input: Partial<z.infer<typeof inputSchema>>,
): Promise<ReturnType<typeof signUpUseCase>> {
  return await startSpan({ name: "signUp Controller" }, async () => {
    const { data, error: inputParseError } = inputSchema.safeParse(input);

    if (inputParseError) {
      throw new InputParseError("Invalid data", { cause: inputParseError });
    }

    return await signUpUseCase(data);
  });
}
