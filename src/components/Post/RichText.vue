<template>
  <div
    v-html="htmlText"
    class="markdown-body text-sm text-gray-800 leading-loose"
  ></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RichText',
  props: {
    htmlText: String,
  },
});
</script>

<style scoped lang="less"></style>

<style lang="less">
@import 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css';

.markdown-body {
  p {
    margin-bottom: 1.25rem;
  }
  ul li {
    list-style: circle;
  }
}
</style>
