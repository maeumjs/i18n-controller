/* eslint-disable @typescript-eslint/no-unused-vars */
/** @ctix-declaration */

import type { I18nContainer } from '#/I18nContainer';
import type { $YMBOL_KEY_I18N_CONTROLLER } from '#/symbols/SYMBOL_KEY_I18N_CONTROLLER';
import type { IClassContainer } from '@maeum/tools';

declare module '@maeum/tools' {
  export interface IClassContainer {
    resolve(name: typeof $YMBOL_KEY_I18N_CONTROLLER): I18nContainer;
  }
}
