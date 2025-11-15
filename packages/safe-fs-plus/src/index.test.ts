import { describe, it, expect } from "vitest";
import {
  ensureDir,
  createTempDir,
  copyFileSafe,
  copyDir,
  dirSize,
  removeSafe
} from "./index";
import * as fs from "fs/promises";
import * as path from "path";

describe("safe-fs-plus", () => {
  it("creates and deletes directories and files safely", async () => {
    const tmp = await createTempDir();
    const filePath = path.join(tmp, "file.txt");

    await ensureDir(tmp);
    await fs.writeFile(filePath, "hello");

    const size = await dirSize(tmp);
    expect(size).toBeGreaterThan(0);

    await removeSafe(tmp, { allowOutsideCwd: true });
  });

  it("copies directories", async () => {
    const src = await createTempDir();
    const dest = await createTempDir("safe-fs-copy-");

    const srcFile = path.join(src, "file.txt");
    await fs.writeFile(srcFile, "hello");

    await copyDir(src, dest);

    const destFile = path.join(dest, "file.txt");
    const contents = await fs.readFile(destFile, "utf8");
    expect(contents).toBe("hello");

    await removeSafe(src, { allowOutsideCwd: true });
    await removeSafe(dest, { allowOutsideCwd: true });
  });
});
