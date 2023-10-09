import type { FastifyRequest } from 'fastify';
import type Polyglot from 'node-polyglot';
import I18nController from './I18nController';

export default function ptu(req: Pick<FastifyRequest, 'headers'>, uo: unknown): string {
  try {
    if (typeof uo === 'object' && uo != null) {
      const { phrase, options } = uo as { phrase: string; options?: Parameters<Polyglot['t']>[1] };

      return I18nController.it.t(
        I18nController.it.getLanguageFromRequestHeader(req.headers['accept-language']),
        phrase,
        options,
      );
    }

    return '';
  } catch {
    return '';
  }
}
