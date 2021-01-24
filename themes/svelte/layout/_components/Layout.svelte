<svelte:head>
  <Analytics />
</svelte:head>

<div>
  <div class="headband" />

  <header
    id="header"
    class="header"
    itemscope
    itemtype="http://schema.org/WPHeader"
  >
    <div class="header-inner">
      <slot name="header" />
    </div>
  </header>

  <main id="main" class="main">
    <div class="main-inner">
      <div class="content-wrap">
        <div id="content" class="content">
          <slot />
        </div>
        <!-- {% include '_third-party/duoshuo-hot-articles.swig' %} -->
        <!-- {% include '_partials/comments.swig' %} -->
      </div>
      <!-- {% block sidebar %}{% endblock %} -->
    </div>
  </main>
</div>

<script lang="ts">
  import Analytics from './Analytics/index.svelte';
</script>
