<template>
  <article class="text-left">
    <h1 class="text-xl text-center break-all text-gray-900 mb-2 font-medium">
      <router-link :to="post.path">
        {{ post.title }}
      </router-link>
    </h1>
    <div class="text-center">1</div>
    <RichText v-if="!!post.excerpt" :html-text="post.excerpt" />
    <a id="more" v-if="post.excerpt && post.content" class="w-0 h-0"></a>
    <RichText v-if="!!post.content" :html-text="post.content" />
  </article>
</template>

<script lang="ts">
import { defineComponent, defineProps, computed } from 'vue';

export default defineComponent({
  name: 'Post',
});
</script>

<script lang="ts" setup>
import RichText from './RichText.vue';

const props = defineProps({
  post: {
    type: Object,
    default: () => ({}),
  },
});

const post = computed(() => props.post || {});
</script>

<style scoped lang="less"></style>
