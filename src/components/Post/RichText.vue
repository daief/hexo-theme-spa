<template>
  <div
    v-html="htmlText"
    class="markdown-body text-sm text-gray-800 leading-loose"
    ref="el"
  ></div>
</template>

<script lang="ts">
import {
  defineComponent,
  defineProps,
  nextTick,
  onMounted,
  ref,
  watch,
} from 'vue';

export default defineComponent({
  name: 'RichText',
});
</script>
mermaid

<script lang="ts" setup>
const props = defineProps({
  htmlText: String,
});

const el = ref<HTMLDivElement>(null);

watch(
  () => props.htmlText,
  () => {
    if (__SSR__) return;
    nextTick(() => {
      import('mermaid').then(mermaid => {
        Array.from(el.value?.querySelectorAll?.('.mermaid') || []).forEach(
          graph => {
            mermaid.init(void 0, graph);
          },
        );
      });
    });
  },
  { immediate: true },
);
</script>

<style scoped lang="less"></style>

<style lang="less">
@import 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css';
@import '~highlight.js/styles/default.css';

.markdown-body {
  ul li {
    list-style: circle;
  }
  ::selection {
    background: #262a30;
    color: #fff;
  }
}
</style>
