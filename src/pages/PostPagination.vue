<template>
  <section class="">
    <div
      v-for="(post, index) in posts"
      :key="index"
      class="relative text-center pb-12"
      :class="[index === posts.length - 1 ? 'mb-0' : 'mb-12']"
    >
      <Post :post="post" />
      <router-link
        :to="post.path + '#more'"
        :class="[
          'flex justify-center items-center',
          'transition-all border-black border-2 text-gray-800 text-xs hover:bg-black hover:text-white',
          'mx-auto h-8 w-28 mt-12 ',
        ]"
        role="button"
      >
        阅读全文 »
      </router-link>
      <div
        v-if="index < posts.length - 1"
        class="h-px absolute bottom-0 w-3/5 bg-gray-300 bg-opacity-45 inset-x-0 mx-auto"
      />
    </div>

    <Pagination
      :total="pageData.total"
      :current="pageData.current"
      link-pattern="/page/%d"
    />
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'PostPagination',
});
</script>

<script lang="ts" setup>
import Post from '@/components/Post/Post.vue';
import Pagination from '@/components/Pagination.vue';
import { usePageData } from '@/hooks/usePageData';

const pageData = usePageData();
const posts = computed(() =>
  (pageData.value.posts || []).map(_ => {
    return {
      ..._,
      content: '',
    };
  }),
);
</script>

<style scoped lang="less"></style>
