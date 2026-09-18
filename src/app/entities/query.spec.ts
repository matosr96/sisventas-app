import { describe, expect, it } from "vitest";
import { EmptyQueryState, toParams } from "./query";

describe("toParams", () => {
  it("omite lo vacío y solo manda dir cuando hay sort", () => {
    expect(toParams({ ...EmptyQueryState })).toEqual({ page: 1, limit: 25 });
    expect(toParams({ ...EmptyQueryState, sort: "name", dir: "asc", search: "  agua ", filters: { status: "ACTIVE", categoryId: null, from: "" } }))
      .toEqual({ page: 1, limit: 25, sort: "name", dir: "asc", search: "agua", status: "ACTIVE" });
  });
});
