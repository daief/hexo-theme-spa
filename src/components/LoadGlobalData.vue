<template />

<script lang="ts">
import { useAxios } from '@/hooks/useAxios';
import { computed, defineComponent, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import NProgress from 'nprogress';
import { pathToKey } from '@/utils';
import { PAGE_NAME_MAP } from '@/utils/route';

export default defineComponent({
  name: 'LoadGlobalData',
  setup() {
    const router = useRouter();
    const [resp, fetchPageData, { cancel }] = useAxios('');
    const store = useStore();

    watch(
      () => resp.value.loading,
      loading => {
        // sync loading state
        store.commit('global/setLoading', loading);
      },
    );

    router.beforeEach(async (to, from) => {
      if (__SSR__) {
        return;
      }

      cancel();
      NProgress.start();
      try {
        const key = pathToKey(to.path);
        const resp = await fetchPageData({
          url: '/json/' + key + '.json',
        });

        await store.commit('global/setPageData', {
          key,
          data: resp.data,
        });
        NProgress.done();
      } catch (error) {
        NProgress.done();

        if (error.isAxiosError && error.response.status === 404) {
          return {
            name: PAGE_NAME_MAP.$404,
            query: {
              ref: from.path,
            },
          };
        }
      }
    });

    return {};
  },
});
</script>
