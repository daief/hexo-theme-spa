import { computed, ComputedRef, unref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { pathToKey } from '@shared';

export function usePageData<T = any>(): ComputedRef<T> {
  const store = useStore();
  const route = useRoute();
  const pageData = computed(() => {
    const key = pathToKey(route.path);
    if (!key) {
      return {};
    }
    return store.state.global.pageDataCache[unref(key)]?.page || {};
  });
  return pageData;
}
