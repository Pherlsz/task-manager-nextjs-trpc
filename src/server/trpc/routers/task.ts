import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { t } from "@/i18n";
import {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  updateTask,
} from "@/server/store/taskStore";
import { publicProcedure, router } from "@/server/trpc/trpc";

const titleSchema = z
  .string()
  .trim()
  .min(1, t("validation.titleRequired"))
  .max(120, t("validation.titleMaxLength"));

const descriptionSchema = z
  .string()
  .trim()
  .max(500, t("validation.descriptionMaxLength"))
  .optional();

const idSchema = z.string().min(1, t("validation.idRequired"));

export const taskRouter = router({
  /**
   * Lists tasks with cursor-based pagination (offset) to support both
   * initial SSR preloading and incremental Infinite Scroll on the client.
   */
  list: publicProcedure
    .input(
      z
        .object({
          cursor: z.number().int().min(0).optional(),
          limit: z.number().int().min(1).max(50).optional(),
        })
        .optional(),
    )
    .query(({ input }) => {
      const cursor = input?.cursor ?? 0;
      const limit = input?.limit ?? 10;
      return listTasks(cursor, limit);
    }),

  getById: publicProcedure
    .input(z.object({ id: idSchema }))
    .query(({ input }) => {
      const task = getTaskById(input.id);

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: t("errors.taskNotFound"),
        });
      }

      return task;
    }),

  create: publicProcedure
    .input(
      z.object({
        title: titleSchema,
        description: descriptionSchema,
      }),
    )
    .mutation(({ input }) => {
      return createTask({
        title: input.title,
        description: input.description,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: idSchema,
        title: titleSchema,
        description: descriptionSchema,
      }),
    )
    .mutation(({ input }) => {
      const updated = updateTask({
        id: input.id,
        title: input.title,
        description: input.description,
      });

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: t("errors.taskNotFound"),
        });
      }

      return updated;
    }),

  delete: publicProcedure
    .input(z.object({ id: idSchema }))
    .mutation(({ input }) => {
      const deleted = deleteTask(input.id);

      if (!deleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: t("errors.taskNotFound"),
        });
      }

      return { id: input.id, deleted: true };
    }),
});
