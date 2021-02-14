<template>
  <div class="p-6 max-w-sm">xx</div>

  <h1>sss</h1>

  <header class="header" itemscope itemtype="http://schema.org/WPHeader">
    <div class="header-inner">
      <!-- {% include '_partials/header/index.swig' %} -->
    </div>
  </header>

  <main class="main">
    <div class="main-inner">
      <slot></slot>
    </div>
  </main>

  <footer class="footer">
    <div class="footer-inner">
      <!-- {% include '_partials/languages.swig' %} -->
    </div>
  </footer>
</template>

<script lang="ts">
export default {
  name: 'Layout',
};
</script>

<script lang="ts" setup></script>
