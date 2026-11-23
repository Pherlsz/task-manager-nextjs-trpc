export const en = {
  meta: {
    title: "Task Manager | Next.js 15 + tRPC",
    newTaskTitle: "New Task | Task Manager",
    editTaskTitle: "Edit Task | Task Manager",
    notFoundTitle: "Page Not Found | Task Manager",
    description:
      "Simple in-memory task management application built with Next.js 15 and tRPC.",
  },
  header: {
    brand: "Task Manager",
    subtitle: "Next.js 15 (SSR) + In-Memory tRPC",
    newTaskButton: "New task",
    backToList: "Back to tasks",
  },
  list: {
    heading: "Tasks",
    countLabel: "Showing {loaded} of {total} tasks",
    emptyTitle: "No tasks yet",
    emptyDescription:
      "Create your first task to try out the full CRUD workflow.",
    createFirstCta: "Create first task",
    createdAt: "Created on {date}",
    editButton: "Edit",
    deleteButton: "Delete",
    deletingButton: "Deleting...",
    deleteAriaLabel: "Delete task {title}",
    editAriaLabel: "Edit task {title}",
    loadingMore: "Loading more tasks...",
    loadMoreButton: "Load more",
    allLoaded: "All tasks have been loaded.",
    deleteSuccess: "Task \"{title}\" deleted successfully.",
    deleteError: "Could not delete task: {message}",
    loadMoreError: "Failed to load more tasks: {message}",
  },
  form: {
    createHeading: "New task",
    editHeading: "Edit task",
    titleLabel: "Title",
    titlePlaceholder: "e.g., Review project requirements",
    descriptionLabel: "Description (optional)",
    descriptionPlaceholder: "Additional details about this task...",
    submitCreate: "Create task",
    submittingCreate: "Creating...",
    submitEdit: "Save changes",
    submittingEdit: "Saving...",
    cancelButton: "Cancel",
    createSuccess: "Task created successfully! Redirecting...",
    editSuccess: "Task updated successfully! Redirecting...",
    submitError: "Failed to save task: {message}",
    notFoundTitle: "Task not found",
    notFoundDescription:
      "The requested task does not exist or has already been removed from memory.",
  },
  validation: {
    idRequired: "Task ID is required.",
    titleRequired: "Task title is required.",
    titleMaxLength: "Task title must be at most 120 characters.",
    descriptionMaxLength: "Task description must be at most 500 characters.",
  },
  errors: {
    taskNotFound: "Task not found.",
    unexpected: "An unexpected error occurred. Please try again.",
    boundaryTitle: "Something went wrong",
    boundaryDescription:
      "We could not complete your request. Please try again or return to the task list.",
    retryButton: "Try again",
    pageNotFoundTitle: "Page not found",
    pageNotFoundDescription:
      "The page you are looking for does not exist in this application.",
  },
  seed: {
    titlePattern: "Sample task #{index}",
    descriptionPattern:
      "Fictitious in-memory task created to demonstrate SSR, CRUD operations, and infinite scrolling (item {index}).",
  },
} as const;

export type Dictionary = typeof en;
