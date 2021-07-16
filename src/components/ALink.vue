<!-- 区分站内外链接 -->
<!-- TODO: [Vue warn]: SSR-optimized slot function detected in a non-SSR-optimized render function. You need to mark this component with $dynamic-slots in the parent template. -->
<template>
  <router-link v-if="!isExternal && !!props.to" v-bind="props"
    ><slot
  /></router-link>
  <a v-else :href="props.to" target="_blank"><slot /></a>
</template>

<script lang="ts">
import { isExternalLink } from '@/utils';
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

const isExternal = computed(() => {
  return isExternalLink(props.to);
});
</script>

<style scoped lang="less"></style>
