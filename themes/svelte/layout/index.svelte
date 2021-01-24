<Layout>
  <div on:click={() => (x += '1')}>
    global: {JSON.stringify(__$$state__)}

    <hr />
    {x}
  </div>
</Layout>

<script lang="ts">
  import Layout from './_components/Layout.svelte';

  let x = '1';
</script>

<style>
  h1 {
    color: red;
  }
  .class {
  }
</style>
