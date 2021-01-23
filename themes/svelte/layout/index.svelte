<div on:click={() => (x += '1')} data-x={x}>
  global: {JSON.stringify(__$$state__)}
</div>

<script lang="ts">
  import { getContext } from 'svelte';

  import A from './_components/A.svelte';

  let x: string = '{{ page.lang || page.language || config.language }}';
</script>

<style>
  h1 {
    color: red;
  }
  .class {
  }
</style>
