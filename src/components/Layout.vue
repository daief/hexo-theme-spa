<template>
  <div v-show="isMobile" class="mobile-top-title bg-primary bg-opacity-25">
    <SiteTitle />
  </div>
  <div class="w-full max-w-screen-lg mx-auto lg:flex">
    <!-- sidebar -->
    <div id="sidebar">
      <SideBarMobile v-if="isMobile" v-model:show="showSideBar" />
      <SideBarPc v-else v-model:show="showSideBar" />
    </div>

    <main class="max-w-full lg:flex-grow lg:w-0" id="main">
      <div class="main-page-content p-7 lg:pt-20">
        <slot></slot>
      </div>
      <Footer />
    </main>
  </div>

  <!-- fixed buttons -->
  <div
    class="fixed bottom-3 right-3 z-10 text-3xl text-white lg:bottom-10 lg:right-10"
  >
    <transition name="fade">
      <button
        class="fixed-side-button"
        v-show="scrollTop > 300"
        @click="handleClickToTop"
      >
        <Icon name="top" />
      </button>
    </transition>
    <button
      class="fixed-side-button"
      @click="showSideBar = true"
      v-if="isMobile"
    >
      <Icon name="bars" />
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
import Footer from './Footer.vue';
import Icon from './Icon.vue';
import SideBarMobile from './SideBar/Mobile.vue';
import SideBarPc from './SideBar/PC.vue';
import SiteTitle from '@/components/site/SiteTitle.vue';
import { useEventListener } from '@vant/use';
import throttle from 'lodash/throttle';

const { isMobile } = useBreakpointPrefix();
const showSideBar = ref(!isMobile.value);

watch(isMobile, () => {
  if (!isMobile.value) {
    showSideBar.value = true;
  }
});

const scrollTop = ref(0);

useEventListener(
  'scroll',
  throttle(e => {
    scrollTop.value = document.documentElement.scrollTop;
  }),
);

const handleClickToTop = () => {
  window.scroll({
    top: 0,
    behavior: 'smooth',
  });
};
</script>

<style lang="less" scoped>
.main-page-content {
  min-height: calc(~'100vh - 110px');
}
.fixed-side-button {
  @apply rounded-full;
  @apply bg-black;
  @apply bg-opacity-50;
  @apply block;
  @apply w-12;
  @apply h-12;
  @apply font-medium;
  @apply shadow;
  @apply flex;
  @apply justify-center;
  @apply items-center;

  & + & {
    @apply mt-4;
  }
}
</style>
