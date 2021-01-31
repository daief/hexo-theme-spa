<div>
  <Link to={page.prev_link}>Pre</Link>
  <Link to={page.next_link}>Next</Link>

  <div>
    {#each page.posts || [] as post}
      <div>
        <Link to={post.path}>
          {post.title}
        </Link>
      </div>
    {/each}
  </div>
</div>

<script lang="ts">
  import { gStore } from '@/store/global';
  import Link from '../_components/widgets/Link.svelte';
  import { getContext } from 'svelte';

  $: page = $gStore.page;
</script>
