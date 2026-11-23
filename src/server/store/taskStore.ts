import { randomUUID } from "node:crypto";
import { t } from "@/i18n";

export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: number;
}

export interface TaskPage {
  items: Task[];
  nextCursor: number | null;
  total: number;
}

const DEFAULT_SEED_COUNT = 25;

function createInitialSeedTasks(): Task[] {
  const now = Date.now();
  const tasks: Task[] = [];

  // Seeds purely fictitious tasks with staggered timestamps to demonstrate ordering and Infinite Scroll.
  for (let i = DEFAULT_SEED_COUNT; i >= 1; i -= 1) {
    tasks.push({
      id: `seed-task-${i}`,
      title: t("seed.titlePattern", { index: i }),
      description:
        i % 4 === 0
          ? undefined
          : t("seed.descriptionPattern", { index: i }),
      createdAt: now - (DEFAULT_SEED_COUNT - i) * 60_000,
    });
  }

  return tasks;
}

// Persist the in-memory store on `globalThis` so Next.js HMR does not reset state during development.
const globalForTasks = globalThis as typeof globalThis & {
  __taskManagerStore?: Task[];
};

function getStore(): Task[] {
  if (!globalForTasks.__taskManagerStore) {
    globalForTasks.__taskManagerStore = createInitialSeedTasks();
  }
  return globalForTasks.__taskManagerStore;
}

export function listTasks(cursor = 0, limit = 10): TaskPage {
  const store = getStore();
  const sorted = [...store].sort((a, b) => b.createdAt - a.createdAt);
  const items = sorted.slice(cursor, cursor + limit);
  const nextOffset = cursor + items.length;

  return {
    items,
    nextCursor: nextOffset < sorted.length ? nextOffset : null,
    total: sorted.length,
  };
}

export function getTaskById(id: string): Task | undefined {
  return getStore().find((task) => task.id === id);
}

export function createTask(input: {
  title: string;
  description?: string;
}): Task {
  const store = getStore();
  const task: Task = {
    id: randomUUID(),
    title: input.title,
    description: input.description || undefined,
    createdAt: Date.now(),
  };

  store.unshift(task);
  return task;
}

export function updateTask(input: {
  id: string;
  title: string;
  description?: string;
}): Task | undefined {
  const store = getStore();
  const index = store.findIndex((task) => task.id === input.id);

  if (index === -1) {
    return undefined;
  }

  const existing = store[index];
  const updated: Task = {
    ...existing,
    title: input.title,
    description: input.description || undefined,
  };

  store[index] = updated;
  return updated;
}

export function deleteTask(id: string): boolean {
  const store = getStore();
  const index = store.findIndex((task) => task.id === id);

  if (index === -1) {
    return false;
  }

  store.splice(index, 1);
  return true;
}
