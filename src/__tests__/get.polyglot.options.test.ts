import { getPolyglotOptions } from '#/modules/getPolyglotOptions';
import { describe, expect, it } from 'vitest';

describe('getPolyglotOptions', () => {
  it('pass - invalid interpolation option', () => {
    const r01 = getPolyglotOptions(
      {
        interpolation: 'interpolation',
        common: { test: 'hello' },
      },
      {},
    );

    expect(r01).toMatchObject({ interpolation: undefined, phrases: { common: { test: 'hello' } } });
  });

  it('pass - invalid interpolation option', () => {
    const r01 = getPolyglotOptions(
      {
        interpolation: 'interpolation',
        common: { test: 'hello' },
      },
      {},
    );

    expect(r01).toMatchObject({ interpolation: undefined, phrases: { common: { test: 'hello' } } });
  });

  it('pass - polyglot interpolation option first', () => {
    const r01 = getPolyglotOptions(
      {
        interpolation: {
          suffix: {},
          prefix: {},
        },
        common: { test: 'hello' },
      },
      {
        polyglot: {
          interpolation: {
            suffix: 'suffix-1',
            prefix: 'prefix-1',
          },
        },
      },
    );

    expect(r01).toMatchObject({
      interpolation: {
        suffix: 'suffix-1',
        prefix: 'prefix-1',
      },
      phrases: {
        common: { test: 'hello' },
      },
    });
  });

  it('pass', () => {
    const r01 = getPolyglotOptions(
      {
        interpolation: {
          suffix: 'suffix-1',
          prefix: 'prefix-1',
        },
        common: { test: 'hello' },
      },
      {},
    );

    expect(r01).toMatchObject({
      interpolation: {
        suffix: 'suffix-1',
        prefix: 'prefix-1',
      },
      phrases: { common: { test: 'hello' } },
    });
  });
});
