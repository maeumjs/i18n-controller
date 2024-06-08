import type { II18nContainerOptions } from '#/interfaces/II18nContainerOptions';
import type { II18nParameters } from '#/interfaces/II18nParameters';
import acceptLanguage from 'accept-language';
import type { IncomingHttpHeaders } from 'http';
import type { IncomingHttpHeaders as IncomingHttp2Headers } from 'http2';
import { orThrow, settify, toArray } from 'my-easy-fp';
import type Polyglot from 'node-polyglot';
import type { ReadonlyDeep } from 'type-fest';

export class I18nContainer {
  #options: II18nContainerOptions;

  #locales: Map<string, Polyglot>;

  #default: Polyglot;

  constructor(options: II18nContainerOptions, locales: Map<string, Polyglot>) {
    this.#options = options;
    this.#locales = locales;
    this.#default = orThrow(
      locales.get(options.defaultLanguage),
      new Error(`no default language resources: ${options.defaultLanguage}`),
    );

    acceptLanguage.languages(
      settify([options.defaultLanguage, ...Array.from(this.#locales.keys())]),
    );
  }

  public get options(): ReadonlyDeep<II18nContainerOptions> {
    return this.#options;
  }

  public get locales(): ReadonlyDeep<Map<string, Polyglot>> {
    return this.#locales;
  }

  public getLanguageFromRequestHeader(languages?: string | string[]): string {
    const language = Array.isArray(languages) ? languages.join(', ') : languages;
    return acceptLanguage.get(language) ?? this.#options.defaultLanguage;
  }

  public getLocale(nullableLanguages?: string | string[]): Polyglot {
    if (nullableLanguages == null) {
      return this.#default;
    }

    const languages = toArray(nullableLanguages);

    if (languages.length <= 0) {
      return this.#default;
    }

    const [first] = languages;
    const language = acceptLanguage.get(first) as string;
    // acceptLanguage.get 함수가 default 언어 또는 사용 가능한 locale을 돌려주기 때문에
    // map 객체에서 undefined가 반환될 일이 없습니다
    //
    // The acceptLanguage.get function never returns undefined in a map object
    // because it returns the default language or an available locale
    const expectPolyglot = this.#locales.get(language) as Polyglot;

    return expectPolyglot;
  }

  public t(
    language: string | string[] | undefined,
    phrase: string,
    option?: number | Polyglot.InterpolationOptions,
  ): string {
    const locale = this.getLocale(language);
    return locale.t(phrase, option);
  }

  public pt(phrase: string, option?: number | Polyglot.InterpolationOptions): string;
  public pt(
    language: string | { headers: IncomingHttpHeaders | IncomingHttp2Headers },
    phrase?: string,
    option?: number | Polyglot.InterpolationOptions,
  ): string;
  public pt(
    language: string | { headers: IncomingHttpHeaders | IncomingHttp2Headers },
    phrase?: string | number | Polyglot.InterpolationOptions,
    option?: number | Polyglot.InterpolationOptions,
  ): string {
    try {
      if (typeof language === 'string' && phrase == null && option == null) {
        return this.t(this.options.defaultLanguage, language);
      }

      if (
        typeof language === 'string' &&
        (typeof phrase === 'number' || typeof phrase === 'object') &&
        option == null
      ) {
        return this.t(this.options.defaultLanguage, language, phrase);
      }

      if (typeof language === 'string' && typeof phrase === 'string') {
        return this.t(language, phrase, option);
      }

      if (typeof language === 'object' && typeof phrase === 'string') {
        return this.t(
          this.getLanguageFromRequestHeader(language.headers['accept-language']),
          phrase,
          option,
        );
      }

      return '';
    } catch {
      return '';
    }
  }

  public ptu(
    req: { headers: IncomingHttpHeaders | IncomingHttp2Headers },
    options: II18nParameters,
  ): string {
    try {
      if (typeof options === 'object' && options != null) {
        const { phrase, option } = options;

        return this.t(
          this.getLanguageFromRequestHeader(req.headers['accept-language']),
          phrase,
          option,
        );
      }

      return '';
    } catch {
      return '';
    }
  }
}
