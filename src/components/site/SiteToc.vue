<template>
  <div v-html="tocHtml"></div>
</template>

<script lang="ts">
import { computed, defineComponent, defineEmit, watch } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({});
</script>

<script lang="ts" setup>
const store = useStore();

const tocHtml = computed(() => store.state.global.pageTocHtml);
</script>

<style scoped lang="less"></style>
