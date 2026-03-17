import { mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { findOversizeAssets } from '../scripts/check-asset-sizes.mjs';

describe('findOversizeAssets', () => {
  it('reports only files above the configured threshold', async () => {
    const root = await mkdir(path.join(os.tmpdir(), `dzipobel-assets-${Date.now()}`), {
      recursive: true
    });
    const small = path.join(root, 'small.txt');
    const large = path.join(root, 'large.txt');

    await writeFile(small, 'ok');
    await writeFile(large, Buffer.alloc(32));

    const oversize = await findOversizeAssets(root, 16);

    expect(oversize).toHaveLength(1);
    expect(oversize[0].relativePath).toBe('large.txt');
    expect(oversize[0].size).toBe(32);
  });
});
