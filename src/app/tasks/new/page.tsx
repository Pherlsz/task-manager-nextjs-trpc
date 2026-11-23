import type { Metadata } from "next";
import { TaskForm } from "@/components/TaskForm";
import { t } from "@/i18n";

export const metadata: Metadata = {
  title: t("meta.newTaskTitle"),
};

export default function NewTaskPage() {
  return <TaskForm mode="create" />;
}
