import { describe, expect, it } from "vitest";

import { isPresent, sleep, slugify } from "./index";

describe("utils", () => {
  it("checks presence correctly", () => {
    expect(isPresent("hello")).toBe(true);
    expect(isPresent(null)).toBe(false);
  });

  it("resolves sleep promise", async () => {
    const start = Date.now();
    await sleep(5);
    expect(Date.now() - start).toBeGreaterThanOrEqual(5);
  });

  it("slugifies strings", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
    expect(slugify("Astra Assistant 2024")).toBe("astra-assistant-2024");
  });
});

