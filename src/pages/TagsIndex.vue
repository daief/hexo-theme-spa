<template>
  <div>Tags</div>
  <div>
    <router-link v-for="(tag, index) in tags" :key="index" :to="tag.path">
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
const tags = computed<Array<ITag & { postCount: number }>>(
  () => unref(pageData).tags || [],
);
</script>
