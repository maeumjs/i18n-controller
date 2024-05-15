import type { II18nContainerOptions } from '#/interfaces/II18nContainerOptions';
import { getAsyncLocaleResource } from '#/modules/getAsyncLocaleResource';
import { getPolyglotOptions } from '#/modules/getPolyglotOptions';
import Polyglot from 'node-polyglot';

export async function getAsyncLocales(
  languages: string[],
  option: Pick<II18nContainerOptions, 'localeRoot' | 'polyglot'>,
) {
  const locales = await languages.reduce(
    async (prevHandle: Promise<Map<string, Polyglot>>, locale) => {
      const handle = async (aggregation: Map<string, Polyglot>) => {
        const resources = await getAsyncLocaleResource(option.localeRoot, locale);
        const polyglotOption = getPolyglotOptions(resources, option);
        const polyglot = new Polyglot({ ...polyglotOption, locale });

        aggregation.set(locale, polyglot);

        return aggregation;
      };

      return handle(await prevHandle);
    },
    Promise.resolve(new Map<string, Polyglot>()),
  );

  return locales;
}
