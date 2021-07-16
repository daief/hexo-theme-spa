<template>
  <img :src="src" />
</template>

<script lang="ts">
import { defineComponent, defineProps } from 'vue';

export default defineComponent({
  name: 'HImage',
});
</script>

<script lang="ts" setup>
defineProps({
  src: String,
});
</script>

<style scoped lang="less">
img {
  font-size: 0;
}
</style>
