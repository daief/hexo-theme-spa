<template>
  <section class="p-7 lg:pt-20">
    <div
      v-for="(post, index) in posts"
      :key="index"
      class="relative text-center pb-12"
      :class="[index === posts.length - 1 ? 'mb-0' : 'mb-12']"
    >
      <Post :post="post" />
      <router-link
        :to="post.path"
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
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'PostPagination',
});
</script>

<script lang="ts" setup>
import Post from '@/components/Post/Post.vue';
import Pagination from '@/components/Pagination.vue';

const store = useStore();
const pageData = computed(() => store.getters['global/page']);
const posts = computed(() =>
  (pageData.value.posts || []).map(_ => {
    delete _.content;
    return _;
  }),
);
</script>

<style scoped lang="less"></style>
