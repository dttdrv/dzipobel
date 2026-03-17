export type AssetInfo = {
  path: string;
  size: number;
};

export function formatBytes(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KiB`;
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MiB`;
}

export function assertAssetSizes(files: AssetInfo[], limit: number) {
  return files.filter((file) => file.size > limit);
}
