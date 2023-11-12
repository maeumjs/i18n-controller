import { I18nController } from '#/I18nController';
import Polyglot from 'node-polyglot';
import { describe, expect, it } from 'vitest';

describe('I18nContainer bootstrap', () => {
  it('synchronous bootstrap', async () => {
    const r01 = I18nController.bootstrap(false, { localeRoot: './resources' });
    expect(r01).toMatchObject({
      ko: new Polyglot({
        locale: 'ko',
        phrases: {
          'common.error': '오류가 발생했습니다, 잠시 후 다시 시도해 주십시오',
          'pet.weight.required': '체중을 입력해주세요',
        },
      }),
      en: new Polyglot({
        phrases: {
          'common.error': 'An error occurred, please try again later',
          'pet.weight.required': 'please enter your weight',
        },
      }),
    });
  });

  it('asynchronous bootstrap', async () => {
    const r01 = await I18nController.bootstrap(true, { localeRoot: './resources' });
    expect(r01).toMatchObject({
      ko: new Polyglot({ locale: 'ko' }),
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
