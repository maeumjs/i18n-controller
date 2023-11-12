import { I18nController } from '#/I18nController';
import type { IncomingHttpHeaders } from 'http';
import type { IncomingHttpHeaders as IncomingHttp2Headers } from 'http2';
import type Polyglot from 'node-polyglot';

export function pt(phrase: string, option?: number | Polyglot.InterpolationOptions): string;
export function pt(
  language: string | { headers: IncomingHttpHeaders | IncomingHttp2Headers },
  phrase?: string,
  option?: number | Polyglot.InterpolationOptions,
): string;
export function pt(
  language: string | { headers: IncomingHttpHeaders | IncomingHttp2Headers },
  phrase?: string | number | Polyglot.InterpolationOptions,
  option?: number | Polyglot.InterpolationOptions,
): string {
  try {
    if (typeof language === 'string' && phrase == null && option == null) {
      return I18nController.it.t(I18nController.it.option.defaultLanguage, language);
    }

    if (
      typeof language === 'string' &&
      (typeof phrase === 'number' || typeof phrase === 'object') &&
      option == null
    ) {
      return I18nController.it.t(I18nController.it.option.defaultLanguage, language, phrase);
    }

    if (typeof language === 'string' && typeof phrase === 'string') {
      return I18nController.it.t(language, phrase, option);
    }

    if (typeof language === 'object' && typeof phrase === 'string') {
      return I18nController.it.t(
        I18nController.it.getLanguageFromRequestHeader(language.headers['accept-language']),
        phrase,
        option,
      );
    }

    return '';
  } catch {
    return '';
  }
}
