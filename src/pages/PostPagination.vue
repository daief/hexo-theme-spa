<template>
  <section class="p-7 lg:pt-20">
    <div
      v-for="(post, index) in posts"
      :key="index"
      class="relative text-center"
      :class="[index === posts.length - 1 ? 'mb-0' : 'mb-12']"
    >
      <Post :post="post" />
      <button
        class="transition-all h-8 w-28 mt-12 mb-12 border-black border-2 text-gray-800 text-xs hover:bg-black hover:text-white"
      >
        阅读全文 »
      </button>
      <div
        v-if="index < posts.length - 1"
        class="h-px absolute b-0 w-3/5 bg-gray-600 bg-opacity-75 inset-x-0 mx-auto"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'PostPagination',
});
</script>

<script lang="ts" setup>
import Post from '@/components/Post/Post.vue';

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
