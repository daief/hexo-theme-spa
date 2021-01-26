// import App from './wrap.svelte';

const App = require(__PAGE_PATH__).default;

if (!__SSR__) {
  window.__app = new App({
    target: document.getElementById('app'),
    props: {},
    hydrate: true,
  });
}

export default App;
