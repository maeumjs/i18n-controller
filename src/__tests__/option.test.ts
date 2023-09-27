import getI18nControllerOption from '#/getI18nContainerOption';
import { describe, expect, it } from 'vitest';

describe('getI18nContainerOption', () => {
  it('empty option', () => {
    expect(() => {
      getI18nControllerOption();
    }).toThrow();
  });

  it('option', () => {
    const r01 = getI18nControllerOption({ localeRoot: 'a' });

    expect(r01).toMatchObject({
      localeRoot: 'a',
      defaultLanguage: 'en',
    });
  });

  it('option with polyglot', () => {
    const polyglotOption = {
      allowMissing: false,
      onMissingKey: (key) => `test:${key}`,
      warn: () => 'warn',
      pluralRules: {
        pluralTypes: {
          germanLike: (n: number) => {
            // is 1
            if (n === 1) {
              return 0;
            }
            // everything else
            return 1;
          },
          frenchLike: (n: number) => {
            // is 0 or 1
            if (n <= 1) {
              return 0;
            }
            // everything else
            return 1;
          },
        },
        pluralTypeToLanguages: {
          germanLike: ['de', 'en', 'xh', 'zu'],
          frenchLike: ['fr', 'hy'],
        },
      },
    };

    const r01 = getI18nControllerOption({
      localeRoot: 'a',
      polyglot: polyglotOption,
    });

    expect(r01).toMatchObject({
      localeRoot: 'a',
      defaultLanguage: 'en',
      polyglot: polyglotOption,
    });
  });
});
