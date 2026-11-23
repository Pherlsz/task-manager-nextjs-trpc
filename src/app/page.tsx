import { TaskList } from "@/components/TaskList";
import { createServerCaller } from "@/server/trpc/root";

/**
 * Forces Server-Side Rendering (SSR) on every request so the page always reflects
 * the current in-memory task list instead of serving stale static HTML.
 */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const caller = createServerCaller({});
  const initialPage = await caller.task.list({ cursor: 0, limit: 10 });

  return <TaskList initialPage={initialPage} />;
}
