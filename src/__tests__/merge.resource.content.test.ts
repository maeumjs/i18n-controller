import { mergeResourceContent } from '#/modules/mergeResourceContent';
import { describe, expect, it } from 'vitest';

describe('mergeResourceContent', () => {
  it('merge resource content', async () => {
    const r01 = mergeResourceContent('string', { v: 'string' });
    const r02 = mergeResourceContent({ k: 'number' }, { v: 'string' });

    expect(r01).toMatchObject({ v: 'string' });
    expect(r02).toMatchObject({ v: 'string', k: 'number' });
  });
});
