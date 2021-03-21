<template>
  <div
    class="fixed z-20 inset-0 bg-black bg-opacity-60"
    v-show="show"
    @click.self="handleOnClickMask"
  >
    <div class="w-80 max-w-10/12 h-full bg-white">
      <Nav />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineEmit, defineProps } from 'vue';

export default defineComponent({});
</script>

<script lang="ts" setup>
import Nav from '@/components/site/Nav.vue';
import { useBreakpointPrefix } from '@/hooks/useBreakPoint';
import { useRouter } from 'vue-router';

const router = useRouter();

const { isMobile } = useBreakpointPrefix();

defineProps({
  show: Boolean,
});

const emit = defineEmit(['update:show']);

function handleOnClickMask() {
  if (!isMobile) return;
  emit('update:show', false);
}

router.afterEach(() => {
  if (isMobile.value) {
    emit('update:show', false);
  }
});
</script>

<style scoped lang="less"></style>
