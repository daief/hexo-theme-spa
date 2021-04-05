<template>
  <div class="">
    <Post :post="post" is-detail />
    <!-- tags -->
    <div class="text-center text-sm">
      <router-link
        v-for="(item, index) in tags"
        :to="item.path"
        :key="index"
        class="transition-all leading-6 inline-block text-gray-700 border-b border-gray-400 hover:border-gray-700"
        ># {{ item.name }}</router-link
      >
    </div>
    <!-- prev & next -->
    <hr class="mt-6 mb-3 border-t-2 bg-gray-400" />
    <div class="flex justify-between">
      <router-link v-if="post.next" :to="post.next.path">
        {{ post.next.title }}
      </router-link>
      <router-link v-if="post.prev" :to="post.prev.path">
        {{ post.prev.title }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, unref } from 'vue';

export default defineComponent({});
</script>

<script lang="ts" setup>
import Post from '@/components/Post/Post.vue';
import { usePageData, useSetPageToc } from '@/hooks/usePageData';

const pageData = usePageData();
const post = computed(() => unref(pageData).post || {});
const tags = computed(() => unref(post).tags || []);
const toc = computed(() => post.value.tocHtml);

useSetPageToc(toc);
</script>

<style scoped lang="less"></style>
