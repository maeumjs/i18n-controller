import type I18nControllerOption from '#/interfaces/I18nControllerOption';

export default function getI18nControllerOption(
  nullableOption?: Partial<Omit<I18nControllerOption, 'polyglot'>> & {
    polyglot?: Partial<I18nControllerOption['polyglot']>;
  },
) {
  const localeRoot = nullableOption?.localeRoot;

  if (localeRoot == null) {
    throw new Error('localeRoot value required');
  }

  const option: I18nControllerOption = {
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
