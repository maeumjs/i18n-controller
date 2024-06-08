import { container } from '#/__tests__/container';
import { CE_DI } from '#/di/CE_DI';
import type { II18nParameters } from '#/interfaces/II18nParameters';
import { makeAsyncI18nContainer } from '#/makeAsyncI18nContainer';
import acceptLanguage from 'accept-language';
import Polyglot from 'node-polyglot';
import { beforeAll, describe, expect, it, vi } from 'vitest';

describe('I18nContainer', () => {
  beforeAll(async () => {
    await makeAsyncI18nContainer(container, { localeRoot: './resources' });
  });

  it('singletone - instance', async () => {
    const i18n = container.resolve(CE_DI.I18N_CONTROLLER);
    expect(i18n).toBeTruthy();
  });

  it('singletone - options', async () => {
    const i18n = container.resolve(CE_DI.I18N_CONTROLLER);
    expect(i18n.options).toMatchObject({
      localeRoot: './resources',
      defaultLanguage: 'en',
    });
  });

  it('singletone - locale', async () => {
    const i18n = container.resolve(CE_DI.I18N_CONTROLLER);

    expect(i18n.locales).toMatchObject(
      new Map([
        ['ko', new Polyglot({ locale: 'ko' })],
        ['en', new Polyglot({ locale: 'en' })],
      ]),
    );
  });

  it('getLocale', async () => {
    const i18n = container.resolve(CE_DI.I18N_CONTROLLER);

    expect(i18n.getLocale('ko')).toMatchObject(new Polyglot({ locale: 'ko' }));
    expect(i18n.getLocale()).toMatchObject(new Polyglot({ locale: 'en' }));
    expect(i18n.getLocale([])).toMatchObject(new Polyglot({ locale: 'en' }));
    expect(i18n.getLocale(['fr'])).toMatchObject(new Polyglot({ locale: 'en' }));
    expect(i18n.getLocale('fr')).toMatchObject(new Polyglot({ locale: 'en' }));
  });

  it('t', async () => {
    const i18n = container.resolve(CE_DI.I18N_CONTROLLER);

    expect(i18n.t('ko', 'common.error')).toEqual(
      '오류가 발생했습니다, 잠시 후 다시 시도해 주십시오',
    );
  });

  it('getLanguageFromRequestHeader', () => {
    const i18n = container.resolve(CE_DI.I18N_CONTROLLER);

    const r01 = i18n.getLanguageFromRequestHeader('en');
    const r02 = i18n.getLanguageFromRequestHeader(['ko', 'en']);
    const r03 = i18n.getLanguageFromRequestHeader('fr');
    const r04 = i18n.getLanguageFromRequestHeader(['fr', 'ge']);

    expect(r01).toEqual('en');
    expect(r02).toEqual('ko');
    expect(r03).toEqual('en');
    expect(r04).toEqual('en');

    vi.spyOn(acceptLanguage, 'get').mockImplementationOnce(() => null);

    const r05 = i18n.getLanguageFromRequestHeader('fr');
    expect(r05).toEqual('en');
  });

  it('pt', async () => {
    const i18n = container.resolve(CE_DI.I18N_CONTROLLER);

    expect(i18n.pt('ko', 'common.error')).toEqual(
      '오류가 발생했습니다, 잠시 후 다시 시도해 주십시오',
    );
    expect(i18n.pt('common.error')).toEqual('An error occurred, please try again later');
    expect(i18n.pt({ headers: { 'accept-language': 'en' } }, 'common.error')).toEqual(
      'An error occurred, please try again later',
    );
    expect(i18n.pt('pet.weight.result', { pet_weight: 30 })).toEqual('your pet weight: 30kg');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    expect(i18n.pt({ headers: { 'accept-language': 'en' } }, 1 as any)).toEqual('');

    vi.spyOn(i18n, 'getLanguageFromRequestHeader').mockImplementationOnce(() => {
      throw new Error('error');
    });

    expect(
      i18n.pt({ headers: { 'accept-language': 'en' } }, 'pet.weight.result', { pet_weight: 30 }),
    ).toEqual('');
  });

  it('ptu', async () => {
    const i18n = container.resolve(CE_DI.I18N_CONTROLLER);

    expect(
      i18n.ptu({ headers: { 'accept-language': 'ko' } }, {
        phrase: 'common.error',
      } satisfies II18nParameters),
    ).toEqual('오류가 발생했습니다, 잠시 후 다시 시도해 주십시오');
    expect(
      i18n.ptu({ headers: { 'accept-language': 'ko' } }, {
        phrase: 'pet.weight.result',
        option: { pet_weight: 30 },
      } satisfies II18nParameters),
    ).toEqual('반려동물 체중: 30kg');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    expect(i18n.ptu({ headers: { 'accept-language': 'ko' } }, 1 as any)).toEqual('');

    vi.spyOn(i18n, 'getLanguageFromRequestHeader').mockImplementationOnce(() => {
      throw new Error('error');
    });

    expect(i18n.ptu({ headers: { 'accept-language': 'ko' } }, { phrase: 'common.error' })).toEqual(
      '',
    );
  });
});
