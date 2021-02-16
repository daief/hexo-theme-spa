<template>
  <i :class="`fa${type} fa-${name}`" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FaIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
    type: {
      // 's' | 'b'
      type: String,
      default: 's',
    },
  },
});
</script>

<style scoped lang="less"></style>
