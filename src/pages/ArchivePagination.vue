<template>
  <div>
    <h1 class="text-2xl mb-6">归档</h1>

    <PostList
      :posts="posts"
      :total="pageData.total"
      :current="pageData.current"
      group-by-year
      pagination-link-pattern="/archives/page/%d"
    />
  </div>
</template>

<script lang="ts">
import { usePageData } from '@/hooks/usePageData';
import { computed, defineComponent, unref } from 'vue';
import type { IPost } from '@/@types/entities';

export default defineComponent({
  name: 'ArchivePagination',
});
</script>

<script lang="ts" setup>
import PostList from '@/components/PostList/index.vue';
import { last } from '@/utils';

const pageData = usePageData();

const posts = computed<IPost[]>(() => unref(pageData).posts || []);

const grouped = computed(() => {
  const ls = unref(posts);
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
