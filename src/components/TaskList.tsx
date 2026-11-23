"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { t } from "@/i18n";
import type { TaskPage } from "@/server/store/taskStore";
import { trpc } from "@/trpc/client";
import { extractTrpcErrorMessage } from "@/trpc/error";

const PAGE_SIZE = 10;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

type Feedback = {
  type: "success" | "error";
  message: string;
} | null;

interface TaskListProps {
  initialPage: TaskPage;
}

export function TaskList({ initialPage }: TaskListProps) {
  const utils = trpc.useUtils();
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  /**
   * Hydrates useInfiniteQuery with the first page preloaded via SSR
   * and fetches subsequent pages incrementally as the user scrolls.
   */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error: listError,
  } = trpc.task.list.useInfiniteQuery(
    { limit: PAGE_SIZE },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      initialData: {
        pages: [initialPage],
        pageParams: [undefined],
      },
    },
  );

  const deleteMutation = trpc.task.delete.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate();
    },
  });

  // Infinite Scroll: observes the bottom sentinel to load the next page automatically.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "120px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Deduplicates by task ID to prevent duplicate React keys if offset shifts between pages.
  const tasks = Array.from(
    new Map(
      (data?.pages.flatMap((page) => page.items) ?? []).map((task) => [
        task.id,
        task,
      ]),
    ).values(),
  );
  const total = data?.pages[0]?.total ?? tasks.length;

  async function handleDelete(id: string, title: string) {
    setFeedback(null);
    setDeletingId(id);

    try {
      await deleteMutation.mutateAsync({ id });
      setFeedback({
        type: "success",
        message: t("list.deleteSuccess", { title }),
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: t("list.deleteError", {
          message: extractTrpcErrorMessage(error),
        }),
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section aria-labelledby="tasks-heading">
      <div className="page-toolbar">
        <h1 id="tasks-heading" className="page-title">
          {t("list.heading")}
        </h1>
        <span className="muted">
          {t("list.countLabel", { loaded: tasks.length, total })}
        </span>
      </div>

      {feedback && (
        <div
          role={feedback.type === "error" ? "alert" : "status"}
          aria-live="polite"
          className={`alert ${
            feedback.type === "error" ? "alert-error" : "alert-success"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {listError && (
        <div role="alert" className="alert alert-error">
          {t("list.loadMoreError", { message: listError.message })}
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="card-panel empty-state">
          <h2 className="task-title">{t("list.emptyTitle")}</h2>
          <p className="muted">{t("list.emptyDescription")}</p>
          <Link href="/tasks/new" className="btn btn-primary">
            {t("list.createFirstCta")}
          </Link>
        </div>
      ) : (
        <>
          <ul className="task-list" role="list">
            {tasks.map((task) => {
              const isDeleting = deletingId === task.id;
              return (
                <li key={task.id} className="task-card">
                  <div className="task-body">
                    <h2 className="task-title">{task.title}</h2>
                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}
                    <p className="task-date">
                      {t("list.createdAt", {
                        date: `${dateFormatter.format(new Date(task.createdAt))} UTC`,
                      })}
                    </p>
                  </div>
                  <div className="task-actions">
                    <Link
                      href={`/tasks/${task.id}/edit`}
                      className="btn"
                      aria-label={t("list.editAriaLabel", {
                        title: task.title,
                      })}
                    >
                      {t("list.editButton")}
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger"
                      disabled={isDeleting}
                      aria-label={t("list.deleteAriaLabel", {
                        title: task.title,
                      })}
                      onClick={() => handleDelete(task.id, task.title)}
                    >
                      {isDeleting
                        ? t("list.deletingButton")
                        : t("list.deleteButton")}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div ref={sentinelRef} className="scroll-footer">
            {isFetchingNextPage ? (
              <p className="muted" aria-live="polite">
                {t("list.loadingMore")}
              </p>
            ) : hasNextPage ? (
              <button
                type="button"
                className="btn"
                onClick={() => void fetchNextPage()}
              >
                {t("list.loadMoreButton")}
              </button>
            ) : (
              <p className="muted">{t("list.allLoaded")}</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
