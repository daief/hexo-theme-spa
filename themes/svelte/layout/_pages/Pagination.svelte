<div>
  <Link to={page.prev_link}>Pre</Link>
  <Link to={page.next_link}>Next</Link>

  <div>
    {#each posts as post}
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

  $: page = $gStore.page;
  $: posts = (page.posts as any[]) || [];
</script>
