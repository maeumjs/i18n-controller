import type { II18nContainerOptions } from '#/interfaces/II18nContainerOptions';
import { getPolyglotOptions } from '#/modules/getPolyglotOptions';
import { getSyncLocaleResource } from '#/modules/getSyncLocaleResource';
import Polyglot from 'node-polyglot';

export function getSyncLocales(
  languages: string[],
  option: Pick<II18nContainerOptions, 'localeRoot' | 'polyglot'>,
) {
  const locales = languages.reduce((aggregation: Map<string, Polyglot>, locale) => {
    const resources = getSyncLocaleResource(option.localeRoot, locale);
    const polyglotOption = getPolyglotOptions(resources, option);
    const polyglot = new Polyglot({ ...polyglotOption, locale });

    aggregation.set(locale, polyglot);

    return aggregation;
  }, new Map<string, Polyglot>());

  return locales;
}
