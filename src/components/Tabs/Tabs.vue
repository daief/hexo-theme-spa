<template>
  <div>
    <div class="flex justify-center z-10" :class="titleClass">
      <span
        v-for="(title, index) in tabs"
        :key="index"
        class="h-8 w-16 mx-2 text-sm flex items-center justify-center border-b border-transparent text-gray-500 transition-all cursor-pointer"
        :class="{
          'text-primary border-primary': index === current,
        }"
        @click="current = index"
      >
        {{ title }}
      </span>
    </div>
    <VNodes :vnodes="children" />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  defineProps,
  provide,
  ref,
  unref,
  useContext,
} from 'vue';

export const TABS_KEY = Symbol('tabs');

export default defineComponent({
  name: 'Tabs',
});
</script>

<script lang="ts" setup>
import VNodes from '@/components/VNodes.vue';

defineProps({
  titleClass: String,
});

const ctx = useContext();
const { slots } = ctx;

const current = ref(0);

const children = computed(() => slots.default?.() || []);

const tabs = computed(() => unref(children).map(it => it.props.title));

provide(TABS_KEY, {
  currentTab: computed(() => tabs.value[current.value]),
});
</script>

<style scoped lang="less"></style>
