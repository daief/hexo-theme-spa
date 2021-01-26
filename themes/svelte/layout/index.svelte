<Layout>
  <Router {url}>
    <nav>
      <Link to="/">Home</Link>
      <Link to="about">About</Link>
      <Link to="post/dsd">Blog</Link>
    </nav>
    <div>
      <Route path="post/:id" component={Post} />
      <!-- <Route path="blog" component={Blog} /> -->
      <!-- <Route path="about" component={About} /> -->
      <Route path="/" component={Home} />
    </div>
  </Router>
</Layout>

<script lang="ts">
  import { Router, Link, Route } from 'svelte-routing';
  import Layout from './_components/Layout.svelte';
  import Home from './_pages/index.svelte';
  import Post from './_pages/post.svelte';

  export let url = '';
</script>

<style>
</style>
