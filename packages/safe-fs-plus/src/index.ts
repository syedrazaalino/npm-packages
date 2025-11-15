import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";

export interface RemoveOptions {
  allowOutsideCwd?: boolean;
}

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

function isSubPath(parent: string, child: string): boolean {
  const rel = path.relative(parent, child);
  return !!rel && !rel.startsWith("..") && !path.isAbsolute(rel);
}

export async function removeSafe(
  targetPath: string,
  options: RemoveOptions = {}
): Promise<void> {
  const resolved = path.resolve(targetPath);
  const cwd = process.cwd();

  if (!options.allowOutsideCwd && !isSubPath(cwd, resolved)) {
    throw new Error("Refusing to delete path outside current working directory");
  }

  if (resolved === cwd || resolved === path.parse(resolved).root) {
    throw new Error("Refusing to delete current working directory or filesystem root");
  }

  try {
    const stat = await fs.lstat(resolved);
    if (stat.isDirectory() && !stat.isSymbolicLink()) {
      const entries = await fs.readdir(resolved);
      await Promise.all(
        entries.map((entry: string) =>
          removeSafe(path.join(resolved, entry), { allowOutsideCwd: true })
        )
      );
      await fs.rmdir(resolved);
    } else {
      await fs.unlink(resolved);
    }
  } catch (error: any) {
    if (error && (error.code === "ENOENT" || error.code === "ENOTDIR")) {
      return;
    }
    throw error;
  }
}

export async function copyFileSafe(src: string, dest: string): Promise<void> {
  const resolvedSrc = path.resolve(src);
  const resolvedDest = path.resolve(dest);

  await ensureDir(path.dirname(resolvedDest));
  await fs.copyFile(resolvedSrc, resolvedDest);
}

export async function copyDir(src: string, dest: string): Promise<void> {
  const resolvedSrc = path.resolve(src);
  const resolvedDest = path.resolve(dest);

  const entries = await fs.readdir(resolvedSrc, { withFileTypes: true });

  await ensureDir(resolvedDest);

  for (const entry of entries) {
    const srcPath = path.join(resolvedSrc, entry.name);
    const destPath = path.join(resolvedDest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isSymbolicLink()) {
      const link = await fs.readlink(srcPath);
      try {
        await fs.symlink(link, destPath);
      } catch {
        await fs.unlink(destPath).catch(() => undefined);
        await fs.symlink(link, destPath);
      }
    } else if (entry.isFile()) {
      await copyFileSafe(srcPath, destPath);
    }
  }
}

export async function dirSize(targetPath: string): Promise<number> {
  const resolved = path.resolve(targetPath);
  const stat = await fs.lstat(resolved);

  if (stat.isDirectory()) {
    const entries = await fs.readdir(resolved, { withFileTypes: true });
    let total = 0;
    for (const entry of entries) {
      const childPath = path.join(resolved, entry.name);
      total += await dirSize(childPath);
    }
    return total;
  }

  return stat.size;
}

export async function createTempDir(prefix = "safe-fs-"): Promise<string> {
  const base = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  return base;
}
