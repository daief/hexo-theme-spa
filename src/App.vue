<template>
  <Analytics />

  <!-- <template v-if="is404"> 404 </template>
  <template v-else>
    <Layout>
      <router-view />
    </Layout>
  </template> -->

  <Layout>
    <router-view />
  </Layout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import Analytics from '@/components/Analytics/index.vue';
import { useRoute } from 'vue-router';
import Layout from './components/Layout.vue';
import { PAGE_NAME_MAP } from '@/utils/route';

export default defineComponent({
  components: {
    Analytics,
    Layout,
  },
  setup() {
    const route = useRoute();
    const is404 = computed(() => route.name === PAGE_NAME_MAP.$404);
    return {
      is404,
    };
  },
});
</script>
