import type Polyglot from 'node-polyglot';

export default interface I18nParameters {
  phrase: string;
  option?: Parameters<Polyglot['t']>[1];
}
