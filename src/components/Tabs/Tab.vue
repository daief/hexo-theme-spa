<template>
  <div v-show="isActive" class="xsd">
    <slot />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, defineProps, inject, unref } from 'vue';
import { TABS_KEY } from './Tabs.vue';

export default defineComponent({
  name: 'Tab',
});
</script>

<script lang="ts" setup>
const { currentTab } = inject(TABS_KEY);

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

const isActive = computed(() => unref(currentTab) === props.title);
</script>

<style scoped lang="less"></style>
