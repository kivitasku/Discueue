import { describe, expect, it } from "vitest";
import { build } from "../src/server.js";

describe("Server", () => {
  it("responds to a request", async () => {
    const app = build();

    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);
  });
});