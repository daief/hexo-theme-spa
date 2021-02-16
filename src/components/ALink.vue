<!-- 区分站内外链接 -->
<!-- TODO: [Vue warn]: SSR-optimized slot function detected in a non-SSR-optimized render function. You need to mark this component with $dynamic-slots in the parent template. -->
<template>
  <a v-if="isExternalLink" :href="props.to" target="_blank"><slot /></a>
  <router-link v-else v-bind="props"><slot /></router-link>
</template>

<script lang="ts">
import { defineProps, computed } from 'vue';

export default {
  name: 'ALink',
};
</script>

<script lang="ts" setup>
const props: any = defineProps({
  to: String,
  replace: Boolean,
});

const a = {
  template: '<a :href="$props.href" target="_blank"><slot /></a>',
};

const isExternalLink = computed(() => {
  const r = /^(http(s)?:\/\/)|(mailto:)|(tel:)/i;
  if (typeof props.to === 'string') {
    return r.test(props.to);
  }
  return false;
});
</script>

<style scoped lang="less"></style>
