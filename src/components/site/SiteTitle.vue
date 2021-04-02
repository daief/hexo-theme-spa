<template>
  <div>
    <router-link :to="root" class="block text-lg text-center py-4">
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
