<Layout>
  <section id="posts" class="posts-expand">
    <!-- {#each __scoped.posts as item}
      <div>{item.title}</div>
    {/each} -->
    <!-- {% for post in page.posts %}
      {{ post_template.render(post, true) }}
    {% endfor %} -->
  </section>
</Layout>

<script lang="ts">
  import Layout from './_components/Layout.svelte';

  let x = '1';
</script>

<style>
  h1 {
    color: red;
  }
  .class {
  }
</style>
