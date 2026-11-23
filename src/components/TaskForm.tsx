"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";
import { t } from "@/i18n";
import type { Task } from "@/server/store/taskStore";
import { trpc } from "@/trpc/client";
import { extractTrpcErrorMessage } from "@/trpc/error";

interface TaskFormProps {
  mode: "create" | "edit";
  initialTask?: Task;
}

export function TaskForm({ mode, initialTask }: TaskFormProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(
    initialTask?.description ?? "",
  );
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement | null>(null);

  const createMutation = trpc.task.create.useMutation();
  const updateMutation = trpc.task.update.useMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;

  function validateForm(): boolean {
    let firstInvalidField: "title" | "description" | null = null;
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setTitleError(t("validation.titleRequired"));
      firstInvalidField = "title";
    } else if (trimmedTitle.length > 120) {
      setTitleError(t("validation.titleMaxLength"));
      firstInvalidField = "title";
    } else {
      setTitleError(null);
    }

    if (trimmedDescription.length > 500) {
      setDescriptionError(t("validation.descriptionMaxLength"));
      firstInvalidField ??= "description";
    } else {
      setDescriptionError(null);
    }

    if (firstInvalidField === "title") {
      titleInputRef.current?.focus();
      return false;
    }

    if (firstInvalidField === "description") {
      descriptionInputRef.current?.focus();
      return false;
    }

    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!validateForm()) {
      return;
    }

    try {
      if (mode === "create") {
        await createMutation.mutateAsync({
          title: title.trim(),
          description: description.trim() || undefined,
        });
        setSubmitSuccess(t("form.createSuccess"));
      } else if (initialTask) {
        await updateMutation.mutateAsync({
          id: initialTask.id,
          title: title.trim(),
          description: description.trim() || undefined,
        });
        setSubmitSuccess(t("form.editSuccess"));
      }

      await utils.task.list.invalidate();
      router.push("/");
      router.refresh();
    } catch (error) {
      setSubmitError(
        t("form.submitError", { message: extractTrpcErrorMessage(error) }),
      );
    }
  }

  return (
    <section aria-labelledby="task-form-heading">
      <div className="page-toolbar">
        <h1 id="task-form-heading" className="page-title">
          {mode === "create" ? t("form.createHeading") : t("form.editHeading")}
        </h1>
        <Link href="/" className="btn">
          {t("header.backToList")}
        </Link>
      </div>

      <div className="card-panel">
        {submitError && (
          <div role="alert" className="alert alert-error">
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div role="status" aria-live="polite" className="alert alert-success">
            {submitSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="form-stack">
          <div className="form-field">
            <label htmlFor="task-title" className="form-label">
              {t("form.titleLabel")}{" "}
              <span className="required-mark" aria-hidden="true">
                *
              </span>
            </label>
            <input
              ref={titleInputRef}
              id="task-title"
              name="title"
              type="text"
              required
              maxLength={120}
              className="form-input"
              placeholder={t("form.titlePlaceholder")}
              value={title}
              disabled={isPending}
              aria-invalid={Boolean(titleError)}
              aria-describedby={titleError ? "task-title-error" : undefined}
              onChange={(event) => {
                setTitle(event.target.value);
                if (titleError) {
                  setTitleError(null);
                }
              }}
            />
            {titleError && (
              <p id="task-title-error" className="field-error">
                {titleError}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="task-description" className="form-label">
              {t("form.descriptionLabel")}
            </label>
            <textarea
              ref={descriptionInputRef}
              id="task-description"
              name="description"
              maxLength={500}
              className="form-textarea"
              placeholder={t("form.descriptionPlaceholder")}
              value={description}
              disabled={isPending}
              aria-invalid={Boolean(descriptionError)}
              aria-describedby={
                descriptionError ? "task-description-error" : undefined
              }
              onChange={(event) => {
                setDescription(event.target.value);
                if (descriptionError) {
                  setDescriptionError(null);
                }
              }}
            />
            {descriptionError && (
              <p id="task-description-error" className="field-error">
                {descriptionError}
              </p>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {mode === "create"
                ? isPending
                  ? t("form.submittingCreate")
                  : t("form.submitCreate")
                : isPending
                  ? t("form.submittingEdit")
                  : t("form.submitEdit")}
            </button>
            <Link href="/" className="btn">
              {t("form.cancelButton")}
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
