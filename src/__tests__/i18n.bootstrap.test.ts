import I18nController from '#/I18nController';
import Polyglot from 'node-polyglot';
import { describe, expect, it } from 'vitest';

describe('I18nContainer bootstrap', () => {
  it('pass - sync', async () => {
    const r01 = I18nController.bootstrap(false, { localeRoot: './resources' });
    expect(r01).toMatchObject({
      kr: new Polyglot({ locale: 'kr' }),
      en: new Polyglot({ locale: 'en' }),
    });
  });

  it('pass - async', async () => {
    const r01 = await I18nController.bootstrap(true, { localeRoot: './resources' });
    expect(r01).toMatchObject({
      kr: new Polyglot({ locale: 'kr' }),
      en: new Polyglot({ locale: 'en' }),
    });
  });

  it('fail - no localeRoot', async () => {
    await expect(async () => {
      await I18nController.bootstrap(true);
    }).rejects.toThrowError();
  });

  it('fail - sync no localeRoot', async () => {
    expect(() => {
      I18nController.bootstrap(false, { localeRoot: './resources', defaultLanguage: '1' });
    }).toThrow();
  });

  it('fail - async no localeRoot', async () => {
    await expect(async () => {
      await I18nController.bootstrap(true, { localeRoot: './resources', defaultLanguage: '1' });
    }).rejects.toThrow();
  });
});
