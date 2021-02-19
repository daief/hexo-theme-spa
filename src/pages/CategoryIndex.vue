<template>
  <div>
    <div>目前共计 {{ pageData.total }} 个分类。</div>
    <div
      v-if="pageData.total > 0"
      @click="proxyAClick.click"
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
