/** ctix-exclude */
import type { IClassContainer } from '@maeum/tools';
import { orThrow } from 'my-easy-fp';

const map = new Map<string | symbol, unknown>();

export const container: IClassContainer = {
  register<T>(name: string | symbol, registration: T): IClassContainer {
    map.set(name, registration);
    return container;
  },

  resolve<K>(name: string | symbol): K {
    const value = map.get(name) as K;
    return orThrow(value, new Error(`Cannot found value(${name.toString()})`));
  },
};
