import { getAsyncLocales } from '#/modules/getAsyncLocales';
import { getSyncLocales } from '#/modules/getSyncLocales';
import Polyglot from 'node-polyglot';
import { describe, expect, it } from 'vitest';

describe('get-locales', () => {
  it('get resource(polyglot instance) synchronously', () => {
    const resources = getSyncLocales(['ko', 'en'], {
      localeRoot: './resources',
    });

    expect(resources).toMatchObject(
      new Map([
        ['ko', new Polyglot({ locale: 'ko' })],
        ['en', new Polyglot({ locale: 'en' })],
      ]),
    );
  });

  it('get resource(polyglot instance) asynchronously', async () => {
    const resources = await getAsyncLocales(['ko', 'en'], { localeRoot: './resources' });

    expect(resources).toMatchObject(
      new Map([
        ['ko', new Polyglot({ locale: 'ko' })],
        ['en', new Polyglot({ locale: 'en' })],
      ]),
    );
  });
});
