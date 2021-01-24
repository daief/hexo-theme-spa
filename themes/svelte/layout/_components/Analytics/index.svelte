<!-- svelte-ignore missing-declaration -->
{#if __theme.google_analytics.ga_measurement_id}
  <GoogleAnalytics />
{/if}

<script lang="ts">
  import GoogleAnalytics from './GoogleAnalytics.svelte';
</script>
