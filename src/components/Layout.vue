<template>
  <div v-show="isMobile">
    <SiteTitle />
  </div>
  <div class="w-full max-w-screen-lg mx-auto lg:flex">
    <!-- sidebar -->
    <div id="sidebar">
      <SideBarMobile v-if="isMobile" v-model:show="showSideBar" />
      <SideBarPc v-else v-model:show="showSideBar" />
    </div>

    <main class="max-w-full lg:flex-grow lg:w-0" id="main">
      <div class="p-7 lg:pt-20">
        <slot></slot>
      </div>
    </main>
  </div>

  <footer class="footer">
    <div class="footer-inner">
      <!-- {% include '_partials/languages.swig' %} -->
    </div>
  </footer>

  <!-- fixed buttons -->
  <div class="fixed bottom-2 right-2 text-2xl">
    <button @click="showSideBar = true" v-if="isMobile">
      <FaIcon name="bars" />
    </button>
  </div>
</template>

<script lang="ts">
import { useBreakpointPrefix } from '@/hooks/useBreakPoint';
import { ref, watch } from 'vue';

export default {
  name: 'Layout',
};
</script>

<script lang="ts" setup>
import FaIcon from './FaIcon.vue';
import SideBarMobile from './SideBar/Mobile.vue';
import SideBarPc from './SideBar/PC.vue';
import SiteTitle from '@/components/site/SiteTitle.vue';

const { isMobile } = useBreakpointPrefix();
const showSideBar = ref(!isMobile.value);

watch(isMobile, () => {
  if (!isMobile.value) {
    showSideBar.value = true;
  }
});
</script>

<style lang="less" scoped></style>
