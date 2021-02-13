<template>
  <div>xx - {{ resp.loading }} - {{ xs }}</div>
</template>

<script lang="ts">
import { useAxios } from '@/hooks/useAxios';
import { computed, defineComponent } from 'vue';
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

    return {
      resp,
      xs: computed(() => JSON.stringify(resp.value.data)),
    };
  },
});
</script>
