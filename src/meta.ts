/**
 * @see https://github.com/nuxt/vue-meta/blob/498d747301617e4f73f1d1f663d613484ffc2367/examples/vue-router/main.js
 */

import {
  createMetaManager,
  defaultConfig,
  resolveOption,
  useMeta,
} from 'vue-meta';

export function createMetaIns() {
  const metaManager = createMetaManager(
    {
      ...defaultConfig,
      esi: {
        group: true,
        namespaced: true,
        // @ts-ignore
        attributes: ['src', 'test', 'text'],
      },
    },
    resolveOption((prevValue, context: any) => {
      const { uid = 0 } = context.vm || {};
      if (!prevValue || prevValue < uid) {
        return uid;
      }
    }),
  );

  useMeta(
    {
      og: {
        something: 'test',
      },
    },
    metaManager,
  );
  return metaManager;
}
