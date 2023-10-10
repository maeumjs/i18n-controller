import I18nController from '#/I18nController';
import type I18nParameters from '#/interfaces/I18nParameters';
import type { FastifyRequest } from 'fastify';

export default function ptu(req: Pick<FastifyRequest, 'headers'>, uo: unknown): string {
  try {
    if (typeof uo === 'object' && uo != null) {
      const { phrase, option } = uo as I18nParameters;

      return I18nController.it.t(
        I18nController.it.getLanguageFromRequestHeader(req.headers['accept-language']),
        phrase,
        option,
      );
    }

    return '';
  } catch {
    return '';
  }
}
