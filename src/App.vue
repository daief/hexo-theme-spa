<template>
  <Analytics />
  <LoadGlobalData />

  <template v-if="is404"> 404 </template>
  <template v-else>
    <Layout>
      <!-- <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view> -->
      <!-- TODO: use keep alive -->
      <router-view />
    </Layout>
  </template>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import Analytics from '@/components/Analytics/index.vue';
import LoadGlobalData from './components/LoadGlobalData.vue';
import { useRoute } from 'vue-router';
import Layout from './components/Layout.vue';
import { PAGE_NAME_MAP } from '@/utils/route';

export default defineComponent({
  components: {
    Analytics,
    LoadGlobalData,
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
