<div>
  ddd: {$gLoading} - {$resp.callTimes}
</div>

<script context="module">
  let skipFirstFlag = true;
</script>

<script lang="ts">
  import { useAxios } from '@/hooks/useAxios';
  import { gLoading, gStore } from '@/store/global';
  import { useLocation } from 'svelte-navigator';
  import { toBase64, formatHtmlPath } from '@shared';

  $gLoading = true;

  const loc = useLocation();
  $: pathname = $loc.pathname;
  const [resp, fetchPageData, { cancel }] = useAxios('');

  $: if (!__SSR__ && pathname) {
    if (!skipFirstFlag) {
      cancel();
      $gStore.page = {};
      fetchPageData({
        url: '/json/' + toBase64(formatHtmlPath(pathname)) + '.json',
      }).then(resp => {
        $gStore = resp.data || {};
      });
    }
    skipFirstFlag = false;
  }
</script>
