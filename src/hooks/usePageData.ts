import { computed } from 'vue';
import { useStore } from 'vuex';

export function usePageData() {
  const store = useStore();
  const pageData = computed(() => store.getters['global/page']);
  return pageData;
}
