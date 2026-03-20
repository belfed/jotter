import { describe, it, expect } from "vitest";
import { getItemTypeForRoute, DEFAULT_ITEM_TYPE, itemTypes } from "./types";

describe("getItemTypeForRoute", () => {
  it("returns 'task' for /tasks", () => {
    expect(getItemTypeForRoute("/tasks")).toBe("task");
  });

  it("returns 'task' for /tasks sub-paths", () => {
    expect(getItemTypeForRoute("/tasks/123")).toBe("task");
  });

  it("returns default type for /inbox", () => {
    expect(getItemTypeForRoute("/inbox")).toBe(DEFAULT_ITEM_TYPE);
  });

  it("returns default type for unknown routes", () => {
    expect(getItemTypeForRoute("/")).toBe(DEFAULT_ITEM_TYPE);
    expect(getItemTypeForRoute("/settings")).toBe(DEFAULT_ITEM_TYPE);
  });
});

describe("itemTypes", () => {
  it("contains inbox and task", () => {
    expect(itemTypes).toContain("inbox");
    expect(itemTypes).toContain("task");
  });
});

describe("DEFAULT_ITEM_TYPE", () => {
  it("is inbox", () => {
    expect(DEFAULT_ITEM_TYPE).toBe("inbox");
  });
});
