<template>
  <div>
    <div class="flex justify-center">
      <span
        v-for="(title, index) in tabs"
        :key="index"
        class="h-8 w-16 mx-2 text-center"
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
