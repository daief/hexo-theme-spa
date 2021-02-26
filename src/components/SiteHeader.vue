<template>
  <header class="" itemscope itemtype="http://schema.org/WPHeader">
    <router-link :to="root" class="block text-lg text-center py-4">
      {{ title }}
    </router-link>

    <nav>
      <ALink
        v-for="item in menus"
        :key="item[0]"
        :to="item[1].link"
        class="block relative px-4 text-sm text-gray-700 leading-7"
        :class="
          item[1].link === route.path ? 'bg-gray-200' : 'hover:bg-gray-200'
        "
      >
        <FaIcon :name="item[1].icon" class="mr-1 text-xs" />
        {{ item[1].name }}
      </ALink>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SiteHeader',
});
</script>

<script lang="ts" setup>
import FaIcon from '@/components/FaIcon.vue';
import ALink from '@/components/ALink.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const title = __baseConfig.title;
const root = __baseConfig.root;
const menus: Array<
  [
    string,
    {
      link;
      icon;
      name;
    },
  ]
> = Object.entries(__theme.menu);
</script>

<style lang="less" scoped>
.nav .router-link-exact-active {
}
</style>
