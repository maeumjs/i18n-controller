import type { TResourceFileContent } from '#/interfaces/TResourceFileContent';
import type { ValueOf } from 'type-fest';

export function mergeResourceContent(
  prev: string | TResourceFileContent,
  next: TResourceFileContent,
): ValueOf<TResourceFileContent> {
  const values: ValueOf<TResourceFileContent> =
    typeof prev === 'string'
      ? next
      : {
          ...next,
          ...prev,
        };
  return values;
}
