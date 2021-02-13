<template>
  <GoogleAnalytics v-if="enableGoogle" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GoogleAnalytics from './GoogleAnalytics.vue';

export default defineComponent({
  components: { GoogleAnalytics },
  name: 'Analytics',
  setup() {
    return {
      enableGoogle: !!__theme.google_analytics.ga_measurement_id,
    };
  },
});
</script>

<style scoped lang="less"></style>
