<template>
  <footer class="footer">
    <div class="footer-inner">
      <ColorPicker :value="themeColor" @update:value="handleColorChange" />
      <router-link to="/404.html">404</router-link>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'Footer',
});
</script>

<script lang="ts" setup>
import ColorPicker from '@/components/ColorPicker.vue';
import { getThemeColor, setTheme } from '@/utils/theme';

const themeColor = ref('');

if (!__SSR__) {
  themeColor.value = getThemeColor();
}
const handleColorChange: any = (color: string, [r, g, b]: number[]) => {
  console.log({ color });

  themeColor.value = color;
  setTheme([r, g, b].join(','));
};
</script>

<style scoped lang="less"></style>
