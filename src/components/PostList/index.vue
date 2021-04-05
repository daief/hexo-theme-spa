<template>
  <div>
    <div v-if="!posts.length">快去写文章吧~</div>
    <div v-else-if="groupByYear">
      <section v-for="[year, list] in grouped" :key="year">
        <div class="text-black">
          {{ year }}
        </div>
        <div>
          <Item v-for="(post, index) in list" :post="post" :key="index" />
        </div>
      </section>
    </div>
    <div v-else>
      <Item v-for="(post, index) in posts" :post="post" :key="index" />
    </div>

    <div class="mt-8" />

    <Pagination
      :total="total"
      :current="current"
      :link-pattern="paginationLinkPattern"
    />
  </div>
</template>

<script lang="ts">
import type { IPost } from '@/@types/entities';
import { last } from '@/utils';
import { computed, defineComponent, defineProps, h, unref } from 'vue';

export default defineComponent({
  name: 'PostList',
});
</script>

<script lang="ts" setup>
import Pagination from '@/components/Pagination.vue';
import Item from './Item.vue';

const props = defineProps({
  posts: {
    type: (Array as unknown) as any[],
    default: [],
  },
  total: Number,
  current: Number,
  groupByYear: Boolean,
  paginationLinkPattern: String,
});

const grouped = computed(() => {
  const ls = unref(props.posts);
  const result: [number, IPost[]][] = [];
  ls.forEach(it => {
    const year = new Date(it.date).getFullYear();
    let lastGroup = last(result);
    if (!lastGroup || lastGroup[0] !== year) {
      result.push([year, [it]]);
    } else {
      lastGroup[1].push(it);
    }
  });
  return result;
});
</script>

<style scoped lang="less"></style>
