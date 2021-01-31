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
  import { useAxios } from '@/hooks/useAxios';
  import { gStore } from '@/store/global';
  import { Link, Route, useLocation } from 'svelte-navigator';
  import Layout from './_components/Layout.svelte';
  import PageWrap from './_components/PageWrap.svelte';
  import Pagination from './_pages/Pagination.svelte';
  import Post from './_pages/Post.svelte';
  import { toBase64, formatHtmlPath } from '../shared';
  import { useIsMounted } from '@/hooks/useIsMounted';
  import { onMount } from 'svelte';

  let skipFirstFlag = true;

  const loc = useLocation();

  $: pathname = $loc.pathname;

  const [, fetchPageData, { cancel }] = useAxios('');

  $: if (!__SSR__ && pathname) {
    if (skipFirstFlag) {
      skipFirstFlag = false;
    } else {
      cancel();
      fetchPageData({
        url: '/json/' + toBase64(formatHtmlPath(pathname)) + '.json',
      }).then(resp => {
        $gStore = resp.data || {};
      });
    }
  }
</script>

<style>
</style>
