import { taskRouter } from "@/server/trpc/routers/task";
import { createCallerFactory, router } from "@/server/trpc/trpc";

export const appRouter = router({
  task: taskRouter,
});

/**
 * Exported router type for end-to-end type safety on the React client without code generation.
 */
export type AppRouter = typeof appRouter;

/**
 * Server-side caller used by React Server Components (SSR) to invoke procedures
 * directly on the server without an internal HTTP round-trip.
 */
export const createServerCaller = createCallerFactory(appRouter);
