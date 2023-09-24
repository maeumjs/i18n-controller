import type I18nContainerOption from '#/interfaces/I18nContainerOption';

export default function getI18nContainerOption(
  nullableOption?: Partial<Omit<I18nContainerOption, 'polyglot'>> & {
    polyglot?: Partial<I18nContainerOption['polyglot']>;
  },
) {
  const localeRoot = nullableOption?.localeRoot;

  if (localeRoot == null) {
    throw new Error('localeRoot value required');
  }

  const option: I18nContainerOption = {
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
