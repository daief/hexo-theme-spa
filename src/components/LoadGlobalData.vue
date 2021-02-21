<template />

<script lang="ts">
import { useAxios } from '@/hooks/useAxios';
import { computed, defineComponent, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { pathToKey } from '@shared';
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
      } catch (error) {
        // TODO 数据加载失败，提示？阻止？
      }

      NProgress.done();
    });

    return {};
  },
});
</script>
