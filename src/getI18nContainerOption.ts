import type { II18nContainerOptions } from '#/interfaces/II18nContainerOptions';

export function getI18nContainerOption(
  nullableOption?: Partial<Omit<II18nContainerOptions, 'polyglot'>> & {
    polyglot?: Partial<II18nContainerOptions['polyglot']>;
  },
) {
  const localeRoot = nullableOption?.localeRoot;

  if (localeRoot == null) {
    throw new Error('localeRoot value required');
  }

  const option: II18nContainerOptions = {
    localeRoot,
    defaultLanguage: nullableOption?.defaultLanguage ?? 'en',
    polyglot: {
      allowMissing: nullableOption?.polyglot?.allowMissing,
      onMissingKey: nullableOption?.polyglot?.onMissingKey,
      warn: nullableOption?.polyglot?.warn,
      pluralRules: nullableOption?.polyglot?.pluralRules,
    },
  };

  return option;
}
