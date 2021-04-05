<template>
  <div>
    <h1 class="mb-6">
      <strong>「{{ tag.name }}」</strong>
      标签下，共有 {{ pageData.count }} 篇
    </h1>

    <PostList
      :posts="posts"
      :total="pageData.total"
      :current="pageData.current"
      :pagination-link-pattern="linkPattern"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, unref } from 'vue';

export default defineComponent({
  name: 'TagsPagination',
});
</script>

<script lang="ts" setup>
import PostList from '@/components/PostList/index.vue';
import { usePageData } from '@/hooks/usePageData';
import type { ITag, IPost } from '@/@types/entities';
import { removePathTailPage } from '@/utils';

const pageData = usePageData();
const tag = computed<ITag>(() => unref(pageData).tag || {});
const posts = computed<IPost[]>(() => unref(pageData).posts || []);

const linkPattern = computed(
  () => removePathTailPage(unref(tag).path || '') + '/page/%d/',
);
</script>
