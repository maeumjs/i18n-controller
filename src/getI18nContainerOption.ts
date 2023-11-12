import type { II18nControllerOption } from '#/interfaces/II18nControllerOption';

export function getI18nControllerOption(
  nullableOption?: Partial<Omit<II18nControllerOption, 'polyglot'>> & {
    polyglot?: Partial<II18nControllerOption['polyglot']>;
  },
) {
  const localeRoot = nullableOption?.localeRoot;

  if (localeRoot == null) {
    throw new Error('localeRoot value required');
  }

  const option: II18nControllerOption = {
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
