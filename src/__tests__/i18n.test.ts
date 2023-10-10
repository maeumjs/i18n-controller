import I18nController from '#/I18nController';
import type I18nParameters from '#/interfaces/I18nParameters';
import pt from '#/pt';
import acceptLanguage from 'accept-language';
import Polyglot from 'node-polyglot';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { ptu } from '..';

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
      ko: new Polyglot({ locale: 'ko' }),
      en: new Polyglot({ locale: 'en' }),
    });
  });

  it('singletone - bootstrap', async () => {
    expect(I18nController.it.bootstrap).toEqual(true);
  });

  it('getLocale', async () => {
    expect(I18nController.it.getLocale('ko')).toMatchObject(new Polyglot({ locale: 'ko' }));
    expect(I18nController.it.getLocale()).toMatchObject(new Polyglot({ locale: 'en' }));
    expect(I18nController.it.getLocale([])).toMatchObject(new Polyglot({ locale: 'en' }));
    expect(I18nController.it.getLocale('fr')).toMatchObject(new Polyglot({ locale: 'en' }));
  });

  it('t', async () => {
    expect(I18nController.it.t('ko', 'common.error')).toEqual(
      '오류가 발생했습니다, 잠시 후 다시 시도해 주십시오',
    );
  });

  it('isBootstrap', async () => {
    expect(I18nController.isBootstrap).toBeTruthy();
  });

  it('getLanguageFromRequestHeader', () => {
    const r01 = I18nController.it.getLanguageFromRequestHeader('en');
    const r02 = I18nController.it.getLanguageFromRequestHeader(['ko', 'en']);
    const r03 = I18nController.it.getLanguageFromRequestHeader('fr');
    const r04 = I18nController.it.getLanguageFromRequestHeader(['fr', 'ge']);

    expect(r01).toEqual('en');
    expect(r02).toEqual('ko');
    expect(r03).toEqual('en');
    expect(r04).toEqual('en');

    vi.spyOn(acceptLanguage, 'get').mockImplementationOnce(() => null);

    const r05 = I18nController.it.getLanguageFromRequestHeader('fr');
    expect(r05).toEqual('en');
  });

  it('pt', async () => {
    expect(pt('ko', 'common.error')).toEqual('오류가 발생했습니다, 잠시 후 다시 시도해 주십시오');
    expect(pt('common.error')).toEqual('An error occurred, please try again later');
    expect(pt({ headers: { 'accept-language': 'en' } }, 'common.error')).toEqual(
      'An error occurred, please try again later',
    );
    expect(pt('pet.weight.result', { pet_weight: 30 })).toEqual('your pet weight: 30kg');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    expect(pt({ headers: { 'accept-language': 'en' } }, 1 as any)).toEqual('');

    vi.spyOn(I18nController.it, 'getLanguageFromRequestHeader').mockImplementationOnce(() => {
      throw new Error('error');
    });

    expect(
      pt({ headers: { 'accept-language': 'en' } }, 'pet.weight.result', { pet_weight: 30 }),
    ).toEqual('');
  });

  it('ptu', async () => {
    expect(
      ptu({ headers: { 'accept-language': 'ko' } }, {
        phrase: 'common.error',
      } satisfies I18nParameters),
    ).toEqual('오류가 발생했습니다, 잠시 후 다시 시도해 주십시오');
    expect(
      ptu({ headers: { 'accept-language': 'ko' } }, {
        phrase: 'pet.weight.result',
        option: { pet_weight: 30 },
      } satisfies I18nParameters),
    ).toEqual('반려동물 체중: 30kg');
    expect(ptu({ headers: { 'accept-language': 'ko' } }, 1)).toEqual('');

    vi.spyOn(I18nController.it, 'getLanguageFromRequestHeader').mockImplementationOnce(() => {
      throw new Error('error');
    });

    expect(ptu({ headers: { 'accept-language': 'ko' } }, { phrase: 'common.error' })).toEqual('');
  });
});
