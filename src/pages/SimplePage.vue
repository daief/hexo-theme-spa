<template>
  <div>
    <Post :post="page" is-detail />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, unref } from 'vue';

export default defineComponent({
  name: 'SimplePage',
});
</script>

<script lang="ts" setup>
import Post from '@/components/Post/Post.vue';
import { usePageData } from '@/hooks/usePageData';

const pageData = usePageData();
const page = computed(() => unref(pageData).page || {});
</script>
