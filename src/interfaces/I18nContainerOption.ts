import type Polyglot from 'node-polyglot';

export default interface I18nContainerOption {
  /**
   * Specify the location of the resource file
   * eg. ./resources
   * */
  localeRoot: string;

  /**
   * Specify the default language. If no language is found when using t function (translate function),
   * the default language translation function is used
   * eg. en
   * */
  defaultLanguage: string;

  /**
   * polyglot option
   *
   * @see https://github.com/airbnb/polyglot.js#options-overview
   * */
  polyglot?: {
    /**
     * a boolean to control whether missing keys in a t call are allowed.
     * If false, by default, a missing key is returned and a warning is issued.
     * */
    allowMissing?: Polyglot.PolyglotOptions['allowMissing'];

    /**
     * an object to change the substitution syntax for interpolation
     * by setting the prefix and suffix fields.
     */
    interpolation?: Polyglot.PolyglotOptions['interpolation'];

    /**
     * if allowMissing is true, and this option is a function,
     * then it will be called instead of the default functionality.
     * Arguments passed to it are key, options, and locale.
     * The return of this function will be used as a translation fallback
     * when polyglot.t('missing.key') is called (hint: return the key).
     */
    onMissingKey?: Polyglot.PolyglotOptions['onMissingKey'];

    warn?: Polyglot.PolyglotOptions['warn'];

    /**
     * an object of pluralTypes and pluralTypeToLanguages to control pluralization logic.
     *
     * @see https://github.com/airbnb/polyglot.js#custom-pluralization-rules
     */
    pluralRules?: Polyglot.PolyglotOptions['pluralRules'];
  };
}
