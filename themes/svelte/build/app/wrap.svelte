<Router {url}>
  <App />
</Router>

<script>
  import { gStore } from '@/store/global';
  import { setContext } from 'svelte';
  import { Router } from 'svelte-navigator';

  const App = require(__PAGE_PATH__).default;

  export let url = '';
  export let data = {};

  const initValue = (__SSR__ ? data : __scoped) || {};
  setContext('$', initValue);
  gStore.set(initValue);
</script>
