import getI18nContainerOption from '#/getI18nContainerOption';
import { describe, expect, it } from 'vitest';

describe('getI18nContainerOption', () => {
  it('empty option', () => {
    expect(() => {
      getI18nContainerOption();
    }).toThrow();
  });

  it('option', () => {
    const r01 = getI18nContainerOption({ localeRoot: 'a' });

    expect(r01).toMatchObject({
      localeRoot: 'a',
      defaultLanguage: 'en',
    });
  });
});
