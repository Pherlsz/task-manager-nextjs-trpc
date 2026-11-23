import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { TRPCError } from "@trpc/server";
import { createServerCaller } from "@/server/trpc/root";

describe("taskRouter (tRPC CRUD + pagination + validation)", () => {
  const caller = createServerCaller({});

  it("lists paginated tasks with nextCursor", async () => {
    const page1 = await caller.task.list({ cursor: 0, limit: 10 });
    assert.equal(page1.items.length, 10);
    assert.equal(page1.nextCursor, 10);
    assert.ok(page1.total >= 25);

    const page2 = await caller.task.list({ cursor: page1.nextCursor, limit: 10 });
    assert.equal(page2.items.length, 10);
    assert.notEqual(page1.items[0].id, page2.items[0].id);
  });

  it("rejects creating a task with an empty title", async () => {
    await assert.rejects(
      () => caller.task.create({ title: "   ", description: "Missing title" }),
      (err: unknown) =>
        err instanceof TRPCError && err.code === "BAD_REQUEST",
    );
  });

  it("runs the full create, read, update, and delete lifecycle", async () => {
    const created = await caller.task.create({
      title: "Unit test task",
      description: "Initial description",
    });

    assert.ok(created.id);
    assert.equal(created.title, "Unit test task");
    assert.equal(typeof created.createdAt, "number");

    const fetched = await caller.task.getById({ id: created.id });
    assert.equal(fetched.id, created.id);

    const updated = await caller.task.update({
      id: created.id,
      title: "Updated unit test task",
      description: "Revised description",
    });
    assert.equal(updated.title, "Updated unit test task");
    assert.equal(updated.createdAt, created.createdAt);

    const deleted = await caller.task.delete({ id: created.id });
    assert.equal(deleted.deleted, true);

    await assert.rejects(
      () => caller.task.getById({ id: created.id }),
      (err: unknown) => err instanceof TRPCError && err.code === "NOT_FOUND",
    );
  });

  it("returns NOT_FOUND when updating or deleting a non-existent task", async () => {
    await assert.rejects(
      () =>
        caller.task.update({
          id: "non-existent-id",
          title: "Does not exist",
        }),
      (err: unknown) => err instanceof TRPCError && err.code === "NOT_FOUND",
    );

    await assert.rejects(
      () => caller.task.delete({ id: "non-existent-id" }),
      (err: unknown) => err instanceof TRPCError && err.code === "NOT_FOUND",
    );
  });
});
