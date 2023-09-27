import I18nController from '#/I18nController';
import Polyglot from 'node-polyglot';
import { beforeAll, describe, expect, it } from 'vitest';

describe('I18nContainer', () => {
  beforeAll(async () => {
    await I18nController.bootstrap(true, { localeRoot: './resources' });
  });

  it('singletone', async () => {
    expect(I18nController.it).toBeTruthy();
  });

  it('singletone - option', async () => {
    expect(I18nController.it.option).toMatchObject({
      localeRoot: './resources',
      defaultLanguage: 'en',
    });
  });

  it('singletone - locale', async () => {
    expect(I18nController.it.locale).toMatchObject({
      kr: new Polyglot({ locale: 'kr' }),
      en: new Polyglot({ locale: 'en' }),
    });
  });

  it('singletone - bootstrap', async () => {
    expect(I18nController.it.bootstrap).toEqual(true);
  });

  it('getLocale', async () => {
    expect(I18nController.it.getLocale('kr')).toMatchObject(new Polyglot({ locale: 'kr' }));
    expect(I18nController.it.getLocale()).toMatchObject(new Polyglot({ locale: 'en' }));
    expect(I18nController.it.getLocale([])).toMatchObject(new Polyglot({ locale: 'en' }));
    expect(I18nController.it.getLocale('fr')).toMatchObject(new Polyglot({ locale: 'en' }));
  });

  it('t', async () => {
    expect(I18nController.it.t('kr', 'common.error')).toEqual(
      '오류가 발생했습니다, 잠시 후 다시 시도해 주십시오',
    );
  });
});
