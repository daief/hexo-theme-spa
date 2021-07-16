import { Module } from 'vuex';

const module: Module<
  {
    // TODO 数据淘汰
    pageDataCache: Record<string, any>;
    loading: boolean;
    pageTocHtml: string;
  },
  any
> = {
  namespaced: true,
  state: () => ({
    pageDataCache: {},
    loading: false,
    pageTocHtml: '',
  }),
  mutations: {
    setState(state, payload) {
      Object.assign(state, { ...payload });
    },
    setPageData(state, { key, data }) {
      state.pageDataCache[key] = data || {};
    },
    setLoading(state, loading: boolean) {
      state.loading = !!loading;
    },
  },
};

export default module;
