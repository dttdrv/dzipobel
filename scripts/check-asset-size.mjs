import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const DEFAULT_LIMIT = 20 * 1024 * 1024;
const rootDir = path.resolve("dist");

function formatBytes(size) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KiB`;
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MiB`;
}

async function collectFiles(dir, root = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath, root)));
      continue;
    }

    if (entry.isFile()) {
      const fileStats = await stat(fullPath);
      files.push({
        path: path.relative(root, fullPath).replaceAll("\\", "/"),
        size: fileStats.size,
      });
    }
  }

  return files;
}

export async function findOversizeAssets(dir, limit) {
  const files = await collectFiles(dir, dir);
  return files
    .map((file) => ({
      relativePath: file.path,
      size: file.size,
    }))
    .filter((file) => file.size > limit);
}

async function main() {
  const limit = Number(process.env.MAX_ASSET_SIZE_BYTES ?? DEFAULT_LIMIT);
  const oversized = await findOversizeAssets(rootDir, limit);

  if (oversized.length > 0) {
    console.error("Assets exceed the configured size limit:");
    oversized.forEach((item) => {
      console.error(`- ${item.relativePath}: ${formatBytes(item.size)}`);
    });
    process.exit(1);
  }
}

const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFilePath) {
  await main();
}
