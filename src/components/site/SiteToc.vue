<template>
  <div
    v-html="tocHtml"
    ref="wrapEl"
    class="site-toc-wrap leading-6 break-all text-sm"
  ></div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({});
</script>

<script lang="ts" setup>
import { useEventListener } from '@vant/use';
import throttle from 'lodash/throttle';

const store = useStore();
const tocHtml = computed(() => store.state.global.pageTocHtml);

const wrapEl = ref<HTMLDivElement>();

const linkList = computed<HTMLAnchorElement[]>(() => {
  if (!wrapEl.value) return [];
  return Array.from(wrapEl.value.querySelectorAll('.nav-link'));
});

const navItemList = computed<HTMLLIElement[]>(() =>
  linkList.value.map(it => it.parentNode as any),
);

const hList = computed<HTMLElement[]>(() => {
  if (__SSR__) return [];
  return linkList.value.map(el =>
    document.getElementById(decodeURIComponent(el.hash.replace(/#/, ''))),
  );
});

let lastActiveEl: any = null;

const TOP_BASE = 2;

useEventListener(
  'scroll',
  throttle(
    e => {
      let currentEl: HTMLElement = null;

      for (let index = 0; index < hList.value.length; index++) {
        currentEl = null;
        const ele = hList.value[index];
        const nextEle = hList.value[index + 1];
        const eleRect = ele.getBoundingClientRect();
        const nextRect = nextEle ? nextEle.getBoundingClientRect() : null;

        if (index === 0 && eleRect.top > TOP_BASE) {
          break;
        }

        if ((!nextRect || nextRect.top > TOP_BASE) && eleRect.top <= TOP_BASE) {
          currentEl = navItemList.value[index];
        }

        if (!currentEl) {
          continue;
        }

        if (lastActiveEl !== currentEl) {
          lastActiveEl = currentEl;

          // remove active
          navItemList.value.forEach(it => {
            if (it.classList.contains('active') && it.contains(currentEl)) {
              return;
            }
            it.classList.remove('active');
          });

          // add active
          currentEl.classList.add('active', 'active-current');

          let upEl = currentEl;
          while (wrapEl.value?.contains(upEl)) {
            upEl = upEl.parentNode as any;
            if (upEl?.classList.contains('nav-item')) {
              upEl.classList.add('active');
            }
          }
        }

        break;
      } // for

      if (lastActiveEl !== currentEl && !currentEl) {
        // no active
        navItemList.value.forEach(it => {
          it.classList.remove('active');
        });
        lastActiveEl = null;
      }
    },
    400,
    { leading: false },
  ),
);
</script>

<style lang="less">
.site-toc-wrap {
  .nav-item {
    ol {
      @apply pl-3;
    }
    a {
      @apply text-gray-700;

      &:hover {
        @apply text-primary;
        @apply text-opacity-70;
      }
    }
    &.active > a {
      @apply transition-all;
      @apply text-primary;
    }
  }
}
</style>
