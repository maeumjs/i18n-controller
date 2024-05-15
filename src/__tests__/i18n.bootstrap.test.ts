import { container } from '#/__tests__/container';
import { makeAsyncI18nContainer } from '#/makeAsyncI18nContainer';
import { makeSyncI18nContainer } from '#/makeSyncI18nContainer';
import { describe, expect, it } from 'vitest';

describe('I18nContainer bootstrap', () => {
  it('synchronous bootstrap', async () => {
    const r01 = makeSyncI18nContainer(container, { localeRoot: './resources' });

    expect(r01.t('ko', 'common.error')).toMatchObject(
      '오류가 발생했습니다, 잠시 후 다시 시도해 주십시오',
    );
  });

  it('asynchronous bootstrap', async () => {
    const r01 = await makeAsyncI18nContainer(container, { localeRoot: './resources' });

    expect(r01.t('ko', 'common.error')).toMatchObject(
      '오류가 발생했습니다, 잠시 후 다시 시도해 주십시오',
    );
  });

  it('fail - no localeRoot in Async', async () => {
    await expect(async () => {
      await makeAsyncI18nContainer(container);
    }).rejects.toThrowError();
  });

  it('fail - no localeRoot in Sync', async () => {
    expect(() => {
      makeSyncI18nContainer(container);
    }).toThrowError();
  });

  it('invalid default languange, cannot found locale-root on sync bootstrap', async () => {
    expect(() => {
      makeSyncI18nContainer(container, { localeRoot: './resources', defaultLanguage: '1' });
    }).toThrow();
  });

  it('fail - async no localeRoot', async () => {
    await expect(async () => {
      await makeAsyncI18nContainer(container, { localeRoot: './resources', defaultLanguage: '1' });
    }).rejects.toThrow();
  });
});
