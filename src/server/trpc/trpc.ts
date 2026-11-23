import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";

/**
 * Base tRPC initialization.
 * The errorFormatter exposes flattened Zod validation errors so the client can display clear messages.
 */
const trpc = initTRPC.create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = trpc.router;
export const publicProcedure = trpc.procedure;
export const createCallerFactory = trpc.createCallerFactory;
