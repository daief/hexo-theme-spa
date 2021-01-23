<script lang="ts">
  import { getContext } from 'svelte';

  import A from './_components/A.svelte';

  const gState: any = getContext('global');

  let locals: any = {};

  let x: string = '{{ page.lang || page.language || config.language }}';

  export let a = 222;

  $: ss =
    locals?.page?.lang || locals?.page?.language || locals?.config?.language;
</script>

<div on:click={() => (x += '1')} data-x={x}>
  <!-- "{{ page.lang || page.language || config.language }}" -->
  asd <br />
  {x}

  -

  {ss} -

  {a}

  <A />

  global: {$gState.a}
</div>

<style>
  h1 {
    color: red;
  }
  .class {
  }
</style>
