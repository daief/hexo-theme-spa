<template>
  <article class="text-left">
    <h1 class="text-xl text-center break-all text-gray-900 mb-2 font-medium">
      <!-- todo to sometime undefined -->
      <router-link :to="post.path || ''">
        {{ post.title }}
      </router-link>
    </h1>
    <!-- meta -->
    <div class="text-center">
      <span class="inline-block text-xs mx-1 text-gray-500" v-if="dateStr">
        <FaIcon name="calendar" />
        <span>
          {{ dateStr }}
        </span>
      </span>
      <span
        class="inline-block text-xs mx-1 text-gray-500"
        v-if="post.categories.length"
      >
        <FaIcon name="folder" />
        <template v-for="(category, index) in post.categories" :key="index">
          <span v-if="index > 0">，</span>
          <router-link :to="`/categories/${category.slug}`" class="underline">
            {{ category.name }}
          </router-link>
        </template>
      </span>
    </div>
    <RichText v-if="!!post.excerpt" :html-text="post.excerpt" />
    <a id="more" v-if="post.excerpt && post.more" class="w-0 h-0"></a>
    <RichText v-if="!!post.more" :html-text="post.more" />
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
import FaIcon from '@/components/FaIcon.vue';

const props = defineProps({
  post: {
    type: Object,
    default: () => ({ categories: [] }),
  },
});

const post = computed(() => props.post || {});

const dateStr = computed(() =>
  post.value.date ? new Date(post.value.date).toLocaleDateString() : '',
);
</script>

<style scoped lang="less"></style>
