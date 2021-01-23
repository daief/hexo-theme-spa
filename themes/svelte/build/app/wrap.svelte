<script>
  import { setContext } from 'svelte';
  import { readable } from 'svelte/store';
  const App = require(__PAGE_PATH__).default;

  export let state;

  if (__SSR__) {
    setContext('global', readable(state));
  } else {
    setContext('global', readable(window.__gState || {}));
  }
</script>

<App />

{JSON.stringify(state)}
