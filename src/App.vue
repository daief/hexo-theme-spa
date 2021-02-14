<template>
  <Analytics />
  <LoadGlobalData />

  <template v-if="$route.name === '404'">
    404
  </template>
  <template v-else>
    <Layout>
      <router-view />
    </Layout>
  </template>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import Analytics from '@/components/Analytics/index.vue';
import LoadGlobalData from './components/LoadGlobalData.vue';
import { useRoute } from 'vue-router';
import Layout from './components/Layout.vue';

export default defineComponent({
  components: {
    Analytics,
    LoadGlobalData,
    Layout,
  },
  setup() {
    const route = useRoute();
    const matchedName = route.matched[0]?.name;

    return {
      matchedName,
    };
  },
});
</script>
