<template>
  <nav>
    <ALink
      v-for="item in menus"
      :key="item[0]"
      :to="item[1].link"
      class="block relative text-sm text-gray-700 leading-8 border-b border-transparent border-solid"
      :class="item[1].link === route.path ? 'text-primary border-primary' : ''"
    >
      <Icon :name="item[1].icon" class="mr-1 text-xs" />
      {{ item[1].name }}
    </ALink>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<script lang="ts" setup>
import ALink from '@/components/ALink.vue';
import Icon from '@/components/Icon.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

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

<style scoped lang="less"></style>
