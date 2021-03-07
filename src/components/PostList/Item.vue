<template>
  <li class="flex">
    <small class="w-24 flex-shrink-0">{{ formatDate(post.date) }}</small>
    <router-link :to="post.path" class="break-all">
      {{ post.title }}
    </router-link>
  </li>
</template>

<script lang="ts">
import { defineComponent, defineProps } from 'vue';

export default defineComponent({
  name: 'Item',
});
</script>

<script lang="ts" setup>
import { formatDate } from '@/utils/format';

defineProps({
  post: {
    type: Object as any,
  },
});
</script>

<style scoped lang="less"></style>
