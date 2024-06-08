import { CE_DI } from '#/di/CE_DI';
import { getI18nContainerOption } from '#/getI18nContainerOption';
import { I18nContainer } from '#/I18nContainer';
import { getAsyncLocales } from '#/modules/getAsyncLocales';
import type { IClassContainer } from '@maeum/tools';
import fs from 'node:fs';
import path from 'node:path';

export async function makeAsyncI18nContainer(
  container: IClassContainer,
  nullableOption?: Parameters<typeof getI18nContainerOption>[0],
): Promise<I18nContainer> {
  const option = getI18nContainerOption(nullableOption);
  const languages = await fs.promises.readdir(option.localeRoot);

  if (!languages.includes(option.defaultLanguage)) {
    throw new Error(
      `default language need: ${path.join(option.localeRoot, option.defaultLanguage)}`,
    );
  }

  const locales = await getAsyncLocales(languages, option);
  const i18n = new I18nContainer(option, locales);

  container.register(CE_DI.I18N_CONTROLLER, i18n);

  return i18n;
}
