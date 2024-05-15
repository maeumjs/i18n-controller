import type { II18nContainerOptions } from '#/interfaces/II18nContainerOptions';
import type { TResourceFileContent } from '#/interfaces/TResourceFileContent';
import type Polyglot from 'node-polyglot';

export function getPolyglotOptions(
  resources: TResourceFileContent,
  option: Pick<II18nContainerOptions, 'polyglot'>,
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
