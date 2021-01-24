import App from './wrap.svelte';

if (!__SSR__) {
  window.__app = new App({
    target: document.getElementById('app'),
    props: {},
    hydrate: true,
  });
}

export default App;