import type I18nContainerOption from '#/interfaces/I18nContainerOption';
import type { PartialDeep } from 'type-fest';

export default function getI18nContainerOption(nullableOption?: PartialDeep<I18nContainerOption>) {
  const localeRoot = nullableOption?.localeRoot;

  if (localeRoot == null) {
    throw new Error('localeRoot value required');
  }

  const option: I18nContainerOption = {
    localeRoot,
    defaultLanguage: nullableOption?.defaultLanguage ?? 'en',
  };

  return option;
}
