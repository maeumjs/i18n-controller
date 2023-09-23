import I18nContainer from '#/I18nContainer';
import Polyglot from 'node-polyglot';
import { describe, expect, it } from 'vitest';

describe('I18nContainer bootstrap', () => {
  it('pass - sync', async () => {
    const r01 = I18nContainer.bootstrap({ localeRoot: './resources' }, false);
    expect(r01).toMatchObject({
      kr: new Polyglot({ locale: 'kr' }),
      en: new Polyglot({ locale: 'en' }),
    });
  });

  it('pass - async', async () => {
    const r01 = await I18nContainer.bootstrap({ localeRoot: './resources' }, true);
    expect(r01).toMatchObject({
      kr: new Polyglot({ locale: 'kr' }),
      en: new Polyglot({ locale: 'en' }),
    });
  });

  it('fail - no localeRoot', async () => {
    expect(() => {
      I18nContainer.bootstrap(undefined, false);
    }).toThrow();
  });

  it('fail - sync no localeRoot', async () => {
    expect(() => {
      I18nContainer.bootstrap({ localeRoot: './resources', defaultLanguage: '1' }, false);
    }).toThrow();
  });

  it('fail - async no localeRoot', async () => {
    await expect(async () => {
      await I18nContainer.bootstrap({ localeRoot: './resources', defaultLanguage: '1' }, true);
    }).rejects.toThrow();
  });
});
