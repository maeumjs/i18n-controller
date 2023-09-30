import I18nController from '#/I18nController';
import Polyglot from 'node-polyglot';
import { describe, expect, it } from 'vitest';

describe('I18nContainer', () => {
  it('getLocaleResourcesSync', () => {
    const resource = I18nController.getLocaleResourceSync('./resources', 'kr');
    expect(resource).toMatchObject({
      common: { error: '오류가 발생했습니다, 잠시 후 다시 시도해 주십시오' },
      pet: { weight: { required: '체중을 입력해주세요' } },
    });
  });

  it('getLocaleResources', async () => {
    const resource = await I18nController.getLocaleResource('./resources', 'kr');
    expect(resource).toMatchObject({
      common: { error: '오류가 발생했습니다, 잠시 후 다시 시도해 주십시오' },
      pet: { weight: { required: '체중을 입력해주세요' } },
    });
  });

  it('getLocalesSync', () => {
    const resources = I18nController.getLocalesSync(['kr', 'en'], {
      localeRoot: './resources',
    });

    expect(resources).toMatchObject({
      kr: new Polyglot({ locale: 'kr' }),
      en: new Polyglot({ locale: 'en' }),
    });
  });

  it('getLocales', async () => {
    const resources = await I18nController.getLocales(['kr', 'en'], { localeRoot: './resources' });

    expect(resources).toMatchObject({
      kr: new Polyglot({ locale: 'kr' }),
      en: new Polyglot({ locale: 'en' }),
    });
  });

  it('getLanguages', async () => {
    const r01 = I18nController.refineLanguages('kr', ['en', 'kr']);
    expect(r01).toEqual(['kr', 'en']);
  });

  it('getLanguages', async () => {
    const r01 = I18nController.mergeResourceContent('string', { v: 'string' });
    const r02 = I18nController.mergeResourceContent({ k: 'number' }, { v: 'string' });

    expect(r01).toMatchObject({ v: 'string' });
    expect(r02).toMatchObject({ v: 'string', k: 'number' });
  });
});

describe('I18nContainer.getPoloyglotInfo', () => {
  it('pass - invalid interpolation option', () => {
    const r01 = I18nController.getPoloyglotInfo(
      {
        interpolation: 'interpolation',
        common: { test: 'hello' },
      },
      {},
    );

    expect(r01).toMatchObject({ interpolation: undefined, phrases: { common: { test: 'hello' } } });
  });

  it('pass - invalid interpolation option', () => {
    const r01 = I18nController.getPoloyglotInfo(
      {
        interpolation: 'interpolation',
        common: { test: 'hello' },
      },
      {},
    );

    expect(r01).toMatchObject({ interpolation: undefined, phrases: { common: { test: 'hello' } } });
  });

  it('pass - polyglot interpolation option first', () => {
    const r01 = I18nController.getPoloyglotInfo(
      {
        interpolation: {
          suffix: {},
          prefix: {},
        },
        common: { test: 'hello' },
      },
      {
        polyglot: {
          interpolation: {
            suffix: 'suffix-1',
            prefix: 'prefix-1',
          },
        },
      },
    );

    expect(r01).toMatchObject({
      interpolation: {
        suffix: 'suffix-1',
        prefix: 'prefix-1',
      },
      phrases: {
        common: { test: 'hello' },
      },
    });
  });

  it('pass', () => {
    const r01 = I18nController.getPoloyglotInfo(
      {
        interpolation: {
          suffix: 'suffix-1',
          prefix: 'prefix-1',
        },
        common: { test: 'hello' },
      },
      {},
    );

    expect(r01).toMatchObject({
      interpolation: {
        suffix: 'suffix-1',
        prefix: 'prefix-1',
      },
      phrases: { common: { test: 'hello' } },
    });
  });
});
