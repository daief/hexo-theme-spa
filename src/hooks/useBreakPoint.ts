import { computed, onMounted, onUnmounted, ref } from 'vue';

export type IBreakpointPrefix = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * @see https://tailwindcss.com/docs/responsive-design
 */
export function getBreakpointPrefix(): IBreakpointPrefix {
  if (__SSR__) return 'lg';
  const w = document.body.clientWidth;
  if (w < 640) return 'xs';
  if (w < 768) return 'sm';
  if (w < 1024) return 'md';
  if (w < 1280) return 'lg';
  if (w < 1536) return 'xl';
  return '2xl';
}

export function useBreakpointPrefix() {
  const value = ref<IBreakpointPrefix>(getBreakpointPrefix());

  const handleResize = () => {
    value.value = getBreakpointPrefix();
  };

  onMounted(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  return {
    prefix: value,
    isMobile: computed(() => ['xs', 'sm', 'md'].includes(value.value)),
  };
}
