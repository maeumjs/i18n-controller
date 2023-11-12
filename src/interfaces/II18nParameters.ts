import type Polyglot from 'node-polyglot';

export interface II18nParameters {
  phrase: string;
  option?: Parameters<Polyglot['t']>[1];
}
