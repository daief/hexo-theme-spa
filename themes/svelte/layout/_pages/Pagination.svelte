<div>
  <Link to={page.prev_link}>Pre</Link>
  <Link to={page.next_link}>Next</Link>

  <div>
    {JSON.stringify($gStore)}
  </div>
</div>

<script lang="ts">
  import { gStore } from '@/store/global';
  import { Router, Link, Route } from 'svelte-navigator';
  import { getContext } from 'svelte';

  $: page = $gStore.page;

  $: {
    !__SSR__ && console.log(page);
  }
</script>
