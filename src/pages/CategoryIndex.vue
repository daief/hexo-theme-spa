<template>
  <div class="">
    <div class="text-center my-4">
      目前共计 {{ pageData.total || 0 }} 个分类。
    </div>
    <div
      v-if="pageData.total > 0"
      @click="proxyAClick.click"
      class="category-list-wrap text-sm px-10"
      v-html="pageData.htmlContent || ''"
    />
    <div v-else>快去创建新的分类吧~</div>
  </div>
</template>

<script lang="ts">
import { usePageData } from '@/hooks/usePageData';
import { useProxyClickA } from '@/hooks/useProxyClickA';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CategoryIndex',
});
</script>

<script lang="ts" setup>
const pageData = usePageData();
const proxyAClick = useProxyClickA();
</script>

<style lang="less">
.category-list-wrap {
  .category-list-item {
    margin: 5px 0;
  }
  .category-list-child {
    list-style-type: circle;
    margin-left: 2em;
  }
  .category-list-count {
    margin-left: 4px;
    color: #555;
  }
  .category-list-link {
    @apply text-gray-700;

    &:hover {
      @apply text-primary;
    }
  }
}
</style>
