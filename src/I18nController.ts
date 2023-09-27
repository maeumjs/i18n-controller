import getI18nContainerOption from '#/getI18nContainerOption';
import type I18nContainerOption from '#/interfaces/I18nContainerOption';
import acceptLanguage from 'accept-language';
import { parse } from 'jsonc-parser';
import { toArray } from 'my-easy-fp';
import Polyglot from 'node-polyglot';
import fs from 'node:fs';
import path from 'node:path';
import type { ReadonlyDeep, ValueOf } from 'type-fest';

type TResourceFileContent = { [key: string]: string | TResourceFileContent };

export default class I18nController {
  static #it: I18nController;

  public static get it() {
    return I18nController.#it;
  }

  public static getLanguages(defaultLanguage: string, languages: string[]): string[] {
    return [defaultLanguage, ...languages.filter((language) => language !== defaultLanguage)];
  }

  static bootstrap<T extends boolean>(
    async?: T,
    nullableOption?: Parameters<typeof getI18nContainerOption>[0],
  ): T extends true ? Promise<Record<string, Polyglot>> : Record<string, Polyglot>;
  static bootstrap<T extends boolean>(
    async?: T,
    nullableOption?: Parameters<typeof getI18nContainerOption>[0],
  ): Record<string, Polyglot> | Promise<Record<string, Polyglot>> {
    const option = getI18nContainerOption(nullableOption);

    if (async) {
      return (async () => {
        const languages = await fs.promises.readdir(option.localeRoot);

        if (!languages.includes(option.defaultLanguage)) {
          throw new Error(
            `default language need: ${path.join(option.localeRoot, option.defaultLanguage)}`,
          );
        }

        const locales = await I18nController.getLocales(languages, option);

        acceptLanguage.languages(I18nController.getLanguages(option.defaultLanguage, languages));

        I18nController.#it = new I18nController(option, locales);

        return locales;
      })();
    }

    const languages = fs.readdirSync(option.localeRoot);

    if (!languages.includes(option.defaultLanguage)) {
      throw new Error(
        `default language need: ${path.join(option.localeRoot, option.defaultLanguage)}`,
      );
    }

    const locales = I18nController.getLocalesSync(languages, option);

    acceptLanguage.languages(I18nController.getLanguages(option.defaultLanguage, languages));

    I18nController.#it = new I18nController(option, locales);

    return locales;
  }

  public static getPoloyglotInfo(
    resources: TResourceFileContent,
    option: Pick<I18nContainerOption, 'polyglot'>,
  ): Polyglot.PolyglotOptions {
    const { interpolation, ...phrases } = resources;

    const interpolationOption: Polyglot.PolyglotOptions['interpolation'] =
      typeof interpolation === 'string'
        ? undefined
        : {
            suffix: typeof interpolation?.suffix === 'string' ? interpolation?.suffix : undefined,
            prefix: typeof interpolation?.prefix === 'string' ? interpolation?.prefix : undefined,
          };

    return { interpolation: option.polyglot?.interpolation ?? interpolationOption, phrases };
  }

  public static async getLocales(
    languages: string[],
    option: Pick<I18nContainerOption, 'localeRoot' | 'polyglot'>,
  ) {
    const locales = await languages.reduce(
      async (prevHandle: Promise<Record<string, Polyglot>>, locale) => {
        const handle = async (prev: Record<string, Polyglot>) => {
          const resources = await I18nController.getLocaleResource(option.localeRoot, locale);
          const polyglotOption = I18nController.getPoloyglotInfo(resources, option);
          const polyglot = new Polyglot({ ...polyglotOption, locale });
          return { ...prev, [locale]: polyglot } satisfies Record<string, Polyglot>;
        };

        return handle(await prevHandle);
      },
      Promise.resolve({}),
    );

    return locales;
  }

  public static getLocalesSync(
    languages: string[],
    option: Pick<I18nContainerOption, 'localeRoot' | 'polyglot'>,
  ) {
    const locales = languages.reduce((aggregation: Record<string, Polyglot>, locale) => {
      const resources = I18nController.getLocaleResourceSync(option.localeRoot, locale);
      const polyglotOption = I18nController.getPoloyglotInfo(resources, option);
      const polyglot = new Polyglot({ ...polyglotOption, locale });
      return { ...aggregation, [locale]: polyglot } satisfies Record<string, Polyglot>;
    }, {});

    return locales;
  }

  public static mergeResourceContent(
    prev: string | TResourceFileContent,
    next: TResourceFileContent,
  ): ValueOf<TResourceFileContent> {
    const v: ValueOf<TResourceFileContent> =
      typeof prev === 'string'
        ? next
        : {
            ...next,
            ...prev,
          };
    return v;
  }

  public static async getLocaleResource(localeRoot: string, locale: string) {
    const namespaces = await fs.promises.readdir(path.join(localeRoot, locale));
    const resource = await namespaces.reduce(
      async (prevHandle: Promise<TResourceFileContent>, namespace) => {
        const handle = async (prevData: TResourceFileContent) => {
          const key = path.basename(namespace, path.extname(namespace));
          const buf = await fs.promises.readFile(path.join(localeRoot, locale, namespace));
          const value = parse(buf.toString()) as TResourceFileContent;

          const prevValue = prevData[key] ?? {};
          const next = I18nController.mergeResourceContent(prevValue, value);

          return { ...prevData, [key]: next };
        };

        return handle(await prevHandle);
      },
      Promise.resolve({}),
    );

    return resource;
  }

  public static getLocaleResourceSync(localeDirPath: string, locale: string) {
    const namespaces = fs.readdirSync(path.join(localeDirPath, locale));
    const resource = namespaces.reduce((aggregation: TResourceFileContent, namespace) => {
      const key = path.basename(namespace, path.extname(namespace));
      const buf = fs.readFileSync(path.join(localeDirPath, locale, namespace));
      const value = parse(buf.toString()) as TResourceFileContent;

      const prevValue = aggregation[key] ?? {};
      const next = I18nController.mergeResourceContent(prevValue, value);

      return { ...aggregation, [key]: next };
    }, {});

    return resource;
  }

  #option: I18nContainerOption;

  #locales: Record<string, Polyglot>;

  #default: Polyglot;

  #bootstrap: boolean = false;

  constructor(option: I18nContainerOption, locales: Record<string, Polyglot>) {
    this.#option = option;
    this.#locales = locales;
    this.#default = locales[option.defaultLanguage] as Polyglot;
    this.#bootstrap = true;
  }

  public get bootstrap(): boolean {
    return this.#bootstrap;
  }

  public get option(): ReadonlyDeep<I18nContainerOption> {
    return this.#option;
  }

  public get locale(): ReadonlyDeep<Record<string, Polyglot>> {
    return this.#locales;
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
    const expectPolyglot = this.#locales[language] as Polyglot;

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
}
