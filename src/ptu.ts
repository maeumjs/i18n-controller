import { I18nController } from '#/I18nController';
import type { II18nParameters } from '#/interfaces/II18nParameters';
import type { IncomingHttpHeaders } from 'http';
import type { IncomingHttpHeaders as IncomingHttp2Headers } from 'http2';

export function ptu(
  req: { headers: IncomingHttpHeaders | IncomingHttp2Headers },
  uo: unknown,
): string {
  try {
    if (typeof uo === 'object' && uo != null) {
      const { phrase, option } = uo as II18nParameters;

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
