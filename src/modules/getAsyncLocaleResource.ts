import type { TResourceFileContent } from '#/interfaces/TResourceFileContent';
import { mergeResourceContent } from '#/modules/mergeResourceContent';
import { parse } from 'jsonc-parser';
import fs from 'node:fs';
import path from 'node:path';

export async function getAsyncLocaleResource(localeRoot: string, locale: string) {
  const namespaces = await fs.promises.readdir(path.join(localeRoot, locale));
  const resource = await namespaces.reduce(
    async (prevHandle: Promise<TResourceFileContent>, namespace) => {
      const handle = async (prevData: TResourceFileContent) => {
        const key = path.basename(namespace, path.extname(namespace));
        const buf = await fs.promises.readFile(path.join(localeRoot, locale, namespace));
        const value = parse(buf.toString()) as TResourceFileContent;

        const prevValue = prevData[key] ?? {};
        const next = mergeResourceContent(prevValue, value);

        return { ...prevData, [key]: next };
      };

      return handle(await prevHandle);
    },
    Promise.resolve({}),
  );

  return resource;
}
