<template>
  <div>
    <h1 class="text-2xl mb-4">归档</h1>
    <div v-if="!posts.length">快去写文章吧~</div>
    <div v-else>
      <section v-for="[year, list] in grouped" :key="year">
        <div>
          {{ year }}
        </div>
        <div>
          <router-link
            v-for="(post, index) in list"
            :key="index"
            :to="post.path"
            class="block"
          >
            <small>
              {{ formatDate(post.date) }}
            </small>
            {{ post.title }}
          </router-link>
        </div>
      </section>
    </div>
    <Pagination
      :total="pageData.total"
      :current="pageData.current"
      link-pattern="/archives/page/%d"
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
import Pagination from '@/components/Pagination.vue';
import { last } from '@/utils';
import { formatDate } from '@/utils/format';

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
