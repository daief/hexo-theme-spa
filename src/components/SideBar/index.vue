<template>
  <div
    class="fixed z-20 inset-0 lg:relative"
    :class="isMobile ? 'bg-black bg-opacity-60' : 'w-64 px-2 mr-2'"
    v-show="show"
    @click.self="handleOnClickMask"
  >
    <div
      :class="{
        'w-10/12 h-full bg-white': isMobile,
      }"
    >
      <SiteHeader />
    </div>
  </div>
</template>

<script lang="ts">
import { defineEmit, defineProps, watch } from 'vue';

export default {
  name: 'SideBar',
};
</script>

<script lang="ts" setup>
import { useBreakpointPrefix } from '@/hooks/useBreakPoint';
import SiteHeader from '@/components/SiteHeader.vue';

const { isMobile } = useBreakpointPrefix();

defineProps({
  show: Boolean,
});

const emit = defineEmit(['update:show']);

function handleOnClickMask() {
  if (!isMobile) return;
  emit('update:show', false);
}

watch(
  () => isMobile.value,
  () => {
    if (!isMobile.value) {
      emit('update:show', true);
    }
  },
);
</script>

<style lang="less" scoped></style>
