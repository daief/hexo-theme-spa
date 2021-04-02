<template>
  <div
    class="fixed z-20 inset-0 bg-black bg-opacity-60"
    v-show="show"
    @click.self="handleOnClickMask"
  >
    <div class="w-80 max-w-10/12 h-full bg-white overflow-y-auto p-2">
      <SiteTitle />
      <div v-if="!hasTocHtml">
        <SiteNav />
      </div>
      <div v-else>
        <Tabs>
          <Tab title="文章目录">
            <SiteToc />
            <SiteToc />
          </Tab>
          <Tab title="站点概况"> 站点概况 </Tab>
          <Tab title="导航">
            <SiteNav />
          </Tab>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  defineEmit,
  defineProps,
  reactive,
  ref,
} from 'vue';

export default defineComponent({});
</script>

<script lang="ts" setup>
import SiteNav from '@/components/site/SiteNav.vue';
import SiteTitle from '@/components/site/SiteTitle.vue';
import SiteToc from '@/components/site/SiteToc.vue';
import { Tabs, Tab } from '@/components/Tabs';
import { useBreakpointPrefix } from '@/hooks/useBreakPoint';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const emit = defineEmit(['update:show']);

const router = useRouter();
const store = useStore();

const hasTocHtml = computed(() => !!store.state.global.pageTocHtml);

const { isMobile } = useBreakpointPrefix();

const tabs = reactive(['文章目录', '站点概况']);

const count = ref(1);

defineProps({
  show: Boolean,
});

function handleOnClickMask() {
  if (!isMobile) return;
  emit('update:show', false);
}

router.afterEach(() => {
  if (isMobile.value) {
    emit('update:show', false);
  }
});
</script>

<style scoped lang="less"></style>
