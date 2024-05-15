import type { TResourceFileContent } from '#/interfaces/TResourceFileContent';
import { mergeResourceContent } from '#/modules/mergeResourceContent';
import { parse } from 'jsonc-parser';
import fs from 'node:fs';
import path from 'node:path';

export function getSyncLocaleResource(localeDirPath: string, locale: string) {
  const namespaces = fs.readdirSync(path.join(localeDirPath, locale));
  const resource = namespaces.reduce((aggregation: TResourceFileContent, namespace) => {
    const key = path.basename(namespace, path.extname(namespace));
    const buf = fs.readFileSync(path.join(localeDirPath, locale, namespace));
    const value = parse(buf.toString()) as TResourceFileContent;

    const prevValue = aggregation[key] ?? {};
    const next = mergeResourceContent(prevValue, value);

    return { ...aggregation, [key]: next };
  }, {});

  return resource;
}
