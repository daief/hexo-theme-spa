<template>
  <div class="">
    <Post :post="post" is-detail />
    <!-- tags -->
    <div class="text-center text-sm my-4" v-if="tags.length > 0">
      <router-link
        v-for="(item, index) in tags"
        :to="item.path"
        :key="index"
        class="transition-all leading-6 inline-block text-gray-700 border-b border-gray-400 hover:border-gray-700 mx-2"
        ># {{ item.name }}</router-link
      >
    </div>
    <!-- prev & next -->
    <hr class="mt-6 mb-3 border-t-2 bg-gray-400" />
    <div class="flex justify-between text-gray-600 text-sm break-all">
      <router-link
        v-if="post.next"
        :to="post.next.path"
        class="a-normal flex-grow w-0 mr-2"
        :title="post.next.title"
      >
        <Icon name="arrow-left" />
        {{ post.next.title }}
      </router-link>
      <router-link
        v-if="post.prev"
        :to="post.prev.path"
        class="text-right a-normal flex-grow w-0 ml-2"
        :title="post.prev.title"
      >
        {{ post.prev.title }}
        <Icon name="arrow-left" class="rotate-180 transform" />
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
import Icon from '@/components/Icon.vue';
import { usePageData, useSetPageToc } from '@/hooks/usePageData';

const pageData = usePageData();
const post = computed(() => unref(pageData).post || {});
const tags = computed(() => unref(post).tags || []);
const toc = computed(() => post.value.tocHtml);

useSetPageToc(toc);
</script>

<style scoped lang="less"></style>
