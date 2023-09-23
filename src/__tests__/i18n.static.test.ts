import I18nContainer from '#/I18nContainer';
import Polyglot from 'node-polyglot';
import { describe, expect, it } from 'vitest';

describe('I18nContainer', () => {
  it('getLocaleResourcesSync', () => {
    const resource = I18nContainer.getLocaleResourceSync('./resources', 'kr');
    expect(resource).toMatchObject({
      common: { error: '오류가 발생했습니다, 잠시 후 다시 시도해 주십시오' },
      pet: { weight: { required: '체중을 입력해주세요' } },
    });
  });

  it('getLocaleResources', async () => {
    const resource = await I18nContainer.getLocaleResource('./resources', 'kr');
    expect(resource).toMatchObject({
      common: { error: '오류가 발생했습니다, 잠시 후 다시 시도해 주십시오' },
      pet: { weight: { required: '체중을 입력해주세요' } },
    });
  });

  it('getLocalesSync', () => {
    const resources = I18nContainer.getLocalesSync(['kr', 'en'], {
      localeRoot: './resources',
    });

    expect(resources).toMatchObject({
      kr: new Polyglot({ locale: 'kr' }),
      en: new Polyglot({ locale: 'en' }),
    });
  });

  it('getLocales', async () => {
    const resources = await I18nContainer.getLocales(['kr', 'en'], { localeRoot: './resources' });

    expect(resources).toMatchObject({
      kr: new Polyglot({ locale: 'kr' }),
      en: new Polyglot({ locale: 'en' }),
    });
  });

  it('getLanguages', async () => {
    const r01 = I18nContainer.getLanguages('kr', ['en', 'kr']);
    expect(r01).toEqual(['kr', 'en']);
  });

  it('getLanguages', async () => {
    const r01 = I18nContainer.mergeResourceContent('string', { v: 'string' });
    const r02 = I18nContainer.mergeResourceContent({ k: 'number' }, { v: 'string' });

    expect(r01).toMatchObject({ v: 'string' });
    expect(r02).toMatchObject({ v: 'string', k: 'number' });
  });
});
