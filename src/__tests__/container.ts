/** ctix-exclude */
import type { IClassContainer } from '@maeum/tools';
import { orThrow } from 'my-easy-fp';

class Container implements IClassContainer {
  #map = new Map<string | symbol, unknown>();

  register<T>(name: string | symbol, registration: T): this {
    this.#map.set(name, registration);
    return this;
  }

  resolve<K>(name: string | symbol): K {
    const value = this.#map.get(name) as K;
    return orThrow(value, new Error(`Cannot found value(${name.toString()})`));
  }
}

export const container = new Container();
