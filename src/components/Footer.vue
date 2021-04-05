<template>
  <footer class="footer text-center text-sm text-gray-600 py-5">
    <div class="copyright flex justify-center items-center h-8">
      <span> &copy; {{ cpYear }} </span>
      <Icon class="with-love mx-2" name="love" />
      <span class="author" itemprop="copyrightHolder">{{ author }}</span>
    </div>
    <div class="flex items-center justify-center h-8">
      <span>
        由
        <a class="" href="https://hexo.io" rel="external nofollow"> Hexo </a>
        强力驱动
      </span>
      <span class="mx-2"> | </span>
      <span>
        主题 -
        <a
          class=""
          href="https://github.com/daief/hexo-theme-spa"
          rel="external nofollow"
        >
          SPA
        </a>
      </span>
      <span class="mx-2"> | </span>
      <span class="text-xs inline-flex">
        <ColorPicker
          :value="themeColor"
          @update:value="handleColorChange"
          class="inline-block"
        />
      </span>
    </div>
    <div class="footer-inner"></div>
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
import Icon from '@/components/Icon.vue';

const themeColor = ref('');

if (!__SSR__) {
  themeColor.value = getThemeColor();
}

const handleColorChange: any = (color: string, [r, g, b]: number[]) => {
  themeColor.value = color;
  setTheme([r, g, b].join(','));
};

const year = new Date().getFullYear();
const cpYear = __theme.since ? `${__theme.since} - ${year}` : year;
const author = __baseConfig.author;
</script>

<style scoped lang="less"></style>
