<LoadGlobalData />
<Layout>
  <nav>
    <Link to="/">Home</Link>
    <Link to="about">About</Link>
    <Link to="post/compile-vue-file-to-js-file">Blog</Link>
    <Link to="page/2">Page</Link>
  </nav>
  <PageWrap>
    <Route path="/post/:id" primary={false} component={Post} />
    <Route path="/page/:no" primary={false} component={Pagination} />
    <Route path="/" primary={false} component={Pagination} />
  </PageWrap>
</Layout>

<script lang="ts">
  import { Link, Route } from 'svelte-navigator';
  import Layout from '@components/Layout.svelte';
  import PageWrap from '@components/PageWrap.svelte';
  import LoadGlobalData from '@components/LoadGlobalData.svelte';
  import Pagination from './_pages/Pagination.svelte';
  import Post from './_pages/Post.svelte';
</script>

<style>
</style>
