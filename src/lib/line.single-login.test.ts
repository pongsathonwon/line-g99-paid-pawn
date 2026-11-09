import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

// Reads the sources from disk (not through Vite), so the check does not count
// as coverage for the files it scans.
const SRC = join(process.cwd(), "src");

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)
      ? [path]
      : [];
  });

const withoutComments = (code: string) =>
  code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

describe("LINE login call site", () => {
  it("only src/lib/line.ts calls liff.login()", () => {
    const callers = sourceFiles(SRC)
      .filter((path) =>
        /liff\s*\.\s*login\s*\(/.test(withoutComments(readFileSync(path, "utf8"))),
      )
      .map((path) => relative(SRC, path).split(sep).join("/"));
    expect(callers).toEqual(["lib/line.ts"]);
  });
});
