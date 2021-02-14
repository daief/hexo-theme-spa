<template />

<script lang="ts">
import { useAxios } from '@/hooks/useAxios';
import { computed, defineComponent, watch } from 'vue';
import { useRouter } from 'vue-router';
import { toBase64, formatHtmlPath } from '@shared';
import { useStore } from 'vuex';

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

    router.afterEach((to, from) => {
      if (__SSR__ || to.path === from.path || isPreRender) {
        isPreRender = false;
        return;
      }

      cancel();
      fetchPageData({
        url: '/json/' + toBase64(formatHtmlPath(to.path)) + '.json',
      }).then(resp => {
        store.commit('global/setPageData', resp.data || {});
      });
    });

    return {};
  },
});
</script>
