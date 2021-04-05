<template>
  <div>
    <router-link
      :to="root"
      class="block text-xl text-center py-4 text-gray-700 font-medium"
    >
      {{ title }}
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<script lang="ts" setup>
const title = __baseConfig.title;
const root = __baseConfig.root;
</script>

<style scoped lang="less"></style>
