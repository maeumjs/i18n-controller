import { getAsyncLocaleResource } from '#/modules/getAsyncLocaleResource';
import { getSyncLocaleResource } from '#/modules/getSyncLocaleResource';
import { describe, expect, it } from 'vitest';

describe('getLocaleResource', () => {
  it('loading resource files synchronously', () => {
    const resource = getSyncLocaleResource('./resources', 'ko');

    expect(resource).toMatchObject({
      common: { error: '오류가 발생했습니다, 잠시 후 다시 시도해 주십시오' },
      pet: { weight: { required: '체중을 입력해주세요' } },
    });
  });

  it('loading resource files asynchronously', async () => {
    const resource = await getAsyncLocaleResource('./resources', 'ko');

    expect(resource).toMatchObject({
      common: { error: '오류가 발생했습니다, 잠시 후 다시 시도해 주십시오' },
      pet: { weight: { required: '체중을 입력해주세요' } },
    });
  });
});
