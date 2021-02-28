<template>
  <div class="w-full max-w-screen-lg mx-auto lg:flex lg:items-start">
    <!-- sidebar -->
    <div id="sidebar">
      <SideBar v-model:show="showSideBar" />
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
import SideBar from './SideBar/index.vue';
import FaIcon from './FaIcon.vue';

export default {
  components: { SideBar, FaIcon },
  name: 'Layout',
};
</script>

<script lang="ts" setup>
const { isMobile } = useBreakpointPrefix();
const showSideBar = ref(!isMobile.value);
</script>

<style lang="less" scoped></style>
