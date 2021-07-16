import { clientPathChangeGuard, pathToKey } from '@/utils';
import { computed, ComputedRef, Ref, unref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

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

export function useSetPageToc(htmlRef: Ref<string>) {
  const store = useStore();
  const router = useRouter();

  watch(
    htmlRef,
    () => {
      store.commit('global/setState', { pageTocHtml: htmlRef.value || '' });
    },
    { immediate: true },
  );

  router.beforeEach(
    clientPathChangeGuard(() => {
      store.commit('global/setState', { pageTocHtml: '' });
    }),
  );
}
