<template />

<script lang="ts">
import { useAxios } from '@/hooks/useAxios';
import { computed, defineComponent, watch } from 'vue';
import { useRouter } from 'vue-router';
import { toBase64, formatHtmlPath } from '@shared';
import { useStore } from 'vuex';
import NProgress from 'nprogress';

let isPreRender = true;

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
      if (__SSR__ || to.path === from.path || isPreRender) {
        isPreRender = false;
        return;
      }

      cancel();
      store.commit('global/setPageData', {});

      NProgress.start();
      try {
        const resp = await fetchPageData({
          url: '/json/' + toBase64(formatHtmlPath(to.path)) + '.json',
        });

        await store.commit('global/setPageData', resp.data || {});
      } catch (error) {
        // TODO 数据加载失败
      }

      NProgress.done();
    });

    return {};
  },
});
</script>
