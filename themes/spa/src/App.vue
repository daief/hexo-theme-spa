<template>
  <Analytics />
  <LoadGlobalData />

  <div>
    Vue app 1
    <router-link to="/">x</router-link>
    <router-link to="/post/compile-vue-file-to-js-file/">post</router-link>
    <div>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Analytics from '@/components/Analytics/index.vue';
import LoadGlobalData from './components/LoadGlobalData.vue';

export default defineComponent({
  components: {
    Analytics,
    LoadGlobalData,
  },
});
</script>
