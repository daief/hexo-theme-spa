<template>
  <div>
    <div>
      <strong>「{{ currentCategory }}」</strong>
      分类下，共有 {{ pageData.count }} 篇
    </div>

    <PostList
      :posts="posts"
      :total="pageData.total"
      :current="pageData.current"
      :pagination-link-pattern="linkPattern"
    />
  </div>
</template>

<script lang="ts">
import { usePageData } from '@/hooks/usePageData';
import { computed, defineComponent, toRaw, unref } from 'vue';

export default defineComponent({
  name: 'CategoryPagination',
});
</script>

<script lang="ts" setup>
import PostList from '@/components/PostList/index.vue';
import { useRoute } from 'vue-router';
import { last, removePathTailPage } from '@/utils';
import type { IPost } from '@/@types/entities';

const pageData = usePageData();
const route = useRoute();

const currentCategory = computed(() =>
  last((route.params.categories as string[]) || []),
);

const posts = computed<IPost[]>(() => unref(pageData).posts || []);

const linkPattern = computed(
  () => removePathTailPage(route.path) + '/page/%d/',
);
</script>
