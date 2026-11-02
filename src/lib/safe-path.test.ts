import { describe, expect, it } from "vitest";
import { toSafeAppPath } from "./safe-path";

describe("toSafeAppPath", () => {
  it.each([
    ["/survey?b=6", "/survey?b=6"],
    ["survey?b=6", "/survey?b=6"],
    ["/survey/linked", "/survey/linked"],
    ["  /home  ", "/home"],
  ])("keeps in-app path %s", (raw, expected) => {
    expect(toSafeAppPath(raw)).toBe(expected);
  });

  it.each([null, undefined, "", "   ", "//evil.com", "/\\evil.com", "https://evil.com"])(
    "refuses %s",
    (raw) => {
      expect(toSafeAppPath(raw)).toBeNull();
    },
  );
});
