import I18nContainer from '#/I18nContainer';
import Polyglot from 'node-polyglot';
import { beforeAll, describe, expect, it } from 'vitest';

describe('I18nContainer', () => {
  beforeAll(async () => {
    await I18nContainer.bootstrap({ localeRoot: './resources' }, true);
  });

  it('singletone', async () => {
    expect(I18nContainer.it).toBeTruthy();
  });

  it('singletone - option', async () => {
    expect(I18nContainer.it.option).toMatchObject({
      localeRoot: './resources',
      defaultLanguage: 'en',
    });
  });

  it('singletone - locale', async () => {
    expect(I18nContainer.it.locale).toMatchObject({
      kr: new Polyglot({ locale: 'kr' }),
      en: new Polyglot({ locale: 'en' }),
    });
  });

  it('getLocale', async () => {
    expect(I18nContainer.it.getLocale('kr')).toMatchObject(new Polyglot({ locale: 'kr' }));
    expect(I18nContainer.it.getLocale()).toMatchObject(new Polyglot({ locale: 'en' }));
    expect(I18nContainer.it.getLocale([])).toMatchObject(new Polyglot({ locale: 'en' }));
    expect(I18nContainer.it.getLocale('fr')).toMatchObject(new Polyglot({ locale: 'en' }));
  });

  it('t', async () => {
    expect(I18nContainer.it.t('kr', 'common.error')).toEqual(
      '오류가 발생했습니다, 잠시 후 다시 시도해 주십시오',
    );
  });
});
