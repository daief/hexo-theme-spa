<template>
  <article class="text-left">
    <h1
      class="text-xl text-center break-all text-gray-900 mt-2 mb-5 font-medium"
    >
      <router-link
        v-if="!isDetail"
        :to="post.path"
        class="a-normal hover:text-primary"
      >
        {{ post.title }}
      </router-link>
      <span v-else class="">
        {{ post.title }}
      </span>
    </h1>

    <!-- TODO meta -->
    <div class="text-center mb-4 text-gray-500">
      <span class="inline-block text-xs mx-2" v-if="dateStr">
        <Icon name="calendar" class="mr-1" />
        <span>
          {{ dateStr }}
        </span>
      </span>
      <span class="inline-block text-xs mx-2" v-if="categories.length">
        <Icon name="folder" class="mr-1" />
        <template v-for="(category, index) in categories" :key="index">
          <span v-if="index > 0">，</span>
          <router-link :to="category.path" class="underline a-normal">
            {{ category.name }}
          </router-link>
        </template>
      </span>
    </div>

    <!-- content -->
    <RichText v-if="!!post.excerpt" :html-text="post.excerpt" />
    <a id="more" v-if="post.excerpt && post.more" class="w-0 h-0"></a>
    <RichText v-if="!!post.more" :html-text="post.more" insert-el-before />
  </article>
</template>

<script lang="ts">
import { defineComponent, defineProps, computed, unref } from 'vue';

export default defineComponent({
  name: 'Post',
});
</script>

<script lang="ts" setup>
import RichText from './RichText.vue';
import Icon from '@/components/Icon.vue';
import type { IPost } from '@/@types/entities';

const props = defineProps({
  post: {
    type: Object,
    default: () => ({ categories: [] }),
  },
  isDetail: Boolean,
});

const post = computed<IPost>(() => props.post || ({} as any));

const categories = computed<any[]>(() => unref(post).categories || []);

const dateStr = computed(() =>
  post.value.date ? new Date(post.value.date).toLocaleDateString() : '',
);
</script>

<style scoped lang="less"></style>
