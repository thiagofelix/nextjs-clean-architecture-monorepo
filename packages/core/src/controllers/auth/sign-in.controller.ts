import type { Cookie } from "@acme/core/entities/models/cookie";
import { signInUseCase } from "@acme/core/use-cases/auth/sign-in.use-case";
import { InputParseError } from "@acme/core/entities/errors/common";
import { startSpan } from "@sentry/nextjs";
import { z } from "zod";

const inputSchema = z.object({
  username: z.string().min(3).max(31),
  password: z.string().min(6).max(31),
});

export async function signInController(
  input: Partial<z.infer<typeof inputSchema>>,
): Promise<Cookie> {
  return await startSpan({ name: "signIn Controller" }, async () => {
    const { data, error: inputParseError } = inputSchema.safeParse(input);

    if (inputParseError) {
      throw new InputParseError("Invalid data", { cause: inputParseError });
    }

    const { cookie } = await signInUseCase(data);
    return cookie;
  });
}
