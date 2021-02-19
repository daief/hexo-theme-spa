<template>
  <div>
    <div @click="proxyAClick.click" v-html="pageData.htmlContent || ''"></div>
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
