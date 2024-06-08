/** @ctix-declaration */

import type { I18nContainer } from '#/I18nContainer';
import type { CE_DI } from '#/di/CE_DI';
import '@maeum/tools';

declare module '@maeum/tools' {
  export interface IClassContainer {
    resolve(name: typeof CE_DI.I18N_CONTROLLER): I18nContainer;
  }
}
