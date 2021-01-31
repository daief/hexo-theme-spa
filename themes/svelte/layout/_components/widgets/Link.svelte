<Link {...$$props} to={to || ''}>
  <slot />
</Link>

<script lang="ts">
  import { Link } from 'svelte-navigator';

  export let to = '';
</script>
