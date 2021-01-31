<div>
  index - {no}

  {JSON.stringify(getContext('$'))}
</div>

<script lang="ts">
  import { getContext } from 'svelte';

  export let no;
</script>
