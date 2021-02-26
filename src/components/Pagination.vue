<template>
  <div v-if="!!total && total > 1">
    <nav class="text-center">
      <a
        v-for="(page, index) in config"
        :key="index"
        class="inline-flex justify-center items-center mx-1 w-7 h-7 cursor-pointer"
        :class="{
          'text-blue-400': page === current,
        }"
        @click="handleClickItem(page)"
      >
        <FaIcon name="angle-double-left" v-if="page === 'pre'" />
        <FaIcon name="angle-double-right" v-else-if="page === 'next'" />
        <span v-else-if="page === 'dot'"> ... </span>
        <span v-else>
          {{ page }}
        </span>
      </a>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineProps, computed, defineEmit } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Pagination',
});
</script>

<script lang="ts" setup>
import FaIcon from '@/components/FaIcon.vue';

const props = defineProps({
  total: Number,
  current: Number,
  linkPattern: String,
});

const emit = defineEmit(['onPageChange']);

const router = useRouter();

const total = computed(() => {
  const s = +props.total;
  return s || 0;
});

const current = computed(() => {
  const s = +props.current;
  return s || 1;
});

type IItem = 'pre' | 'next' | 'dot' | number;

const delta = 3;

const config = computed(() => {
  const currentValue = current.value;
  const totalValue = total.value;

  const headDelta = currentValue;
  const tailDelta = totalValue - currentValue;

  return [
    ['pre', currentValue > 1],
    [1, currentValue !== 1],
    ['dot', headDelta > delta + 1],
    [currentValue - 2, currentValue > delta],
    [currentValue - 1, currentValue > delta - 1],
    [currentValue, true],
    [currentValue + 1, currentValue <= totalValue - delta + 1],
    [currentValue + 2, currentValue <= totalValue - delta],
    ['dot', tailDelta > delta],
    [totalValue, currentValue !== totalValue],
    ['next', currentValue !== totalValue],
  ]
    .filter(([, show]) => show)
    .map(_ => _[0]) as IItem[];
});

function getNewPage(item: IItem) {
  let newPage = current.value;

  if (item === 'pre') {
    newPage = current.value - 1;
  } else if (item === 'next') {
    newPage = current.value + 1;
  } else if (item === 'dot') {
    // empty
  } else {
    newPage = item;
  }
  return newPage;
}

function handleClickItem(item: IItem) {
  const newPage = getNewPage(item);

  if (newPage === current.value) {
    return;
  }

  if (typeof props.linkPattern === 'string') {
    const newPath = props.linkPattern.replace(/\%d/gi, newPage + '');
    router.push(newPath);
  }

  emit('onPageChange', newPage);
}
</script>

<style scoped lang="less"></style>
