<template>
  <div class="text-center my-4 text-lg">
    目前共计 {{ tags.length || 0 }} 个标签。
  </div>
  <div class="break-words text-center text-base">
    <router-link
      v-for="(tag, index) in tags"
      :key="index"
      :to="tag.path"
      class="a-normal whitespace-nowrap mx-3 my-1 inline-block"
    >
      {{ tag.name }} {{ tag.postCount }}
    </router-link>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, unref } from 'vue';

export default defineComponent({
  name: 'TagsIndex',
});
</script>

<script lang="ts" setup>
import { usePageData } from '@/hooks/usePageData';
import type { ITag } from '@/@types/entities';

const pageData = usePageData();
const tags = computed<Array<ITag & { postCount: number }>>(() =>
  [...(unref(pageData).tags || [])].sort((a, b) => b.postCount - a.postCount),
);
</script>
