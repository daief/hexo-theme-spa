<template>
  <div
    class="pc-sider-bar z-20 inset-0 relative w-64 px-2 mr-2 h-full"
    v-show="show"
  >
    <div class="mb-10">
      <SiteTitle />
      <SiteNav />
    </div>
    <div class="sticky top-5">
      <div v-if="hasTocHtml">
        <Tabs title-class="tabs-title">
          <Tab title="文章目录">
            <SiteToc />
          </Tab>
          <Tab title="站点概况">
            <SiteProfile />
          </Tab>
        </Tabs>
      </div>
      <div v-else>
        <SiteProfile />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineEmit, defineProps, watch } from 'vue';

export default {
  name: 'SideBar',
};
</script>

<script lang="ts" setup>
import { useBreakpointPrefix } from '@/hooks/useBreakPoint';
import SiteNav from '@/components/site/SiteNav.vue';
import SiteTitle from '@/components/site/SiteTitle.vue';
import SiteToc from '@/components/site/SiteToc.vue';
import SiteProfile from '@/components/site/SiteProfile.vue';
import { Tabs, Tab } from '@/components/Tabs';
import { useStore } from 'vuex';

const { isMobile } = useBreakpointPrefix();

defineProps({
  show: Boolean,
});

const emit = defineEmit(['update:show']);

const store = useStore();

const hasTocHtml = computed(() => !!store.state.global.pageTocHtml);
</script>

<style lang="less" scoped>
.pc-sider-bar {
  /deep/ .tabs-title {
    @apply mb-5;
  }
}
</style>
