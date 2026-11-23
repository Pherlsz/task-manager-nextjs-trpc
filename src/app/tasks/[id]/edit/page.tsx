import { TRPCError } from "@trpc/server";
import type { Metadata } from "next";
import Link from "next/link";
import { TaskForm } from "@/components/TaskForm";
import { t } from "@/i18n";
import { createServerCaller } from "@/server/trpc/root";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: t("meta.editTaskTitle"),
};

interface EditTaskPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;
  const caller = createServerCaller({});

  try {
    const task = await caller.task.getById({ id });
    return <TaskForm mode="edit" initialTask={task} />;
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      return (
        <section className="card-panel empty-state">
          <h1 className="page-title">{t("form.notFoundTitle")}</h1>
          <p className="muted">{t("form.notFoundDescription")}</p>
          <Link href="/" className="btn btn-primary">
            {t("header.backToList")}
          </Link>
        </section>
      );
    }

    throw error;
  }
}
