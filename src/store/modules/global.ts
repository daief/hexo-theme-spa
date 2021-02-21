import { Module } from 'vuex';

const module: Module<
  {
    // TODO 数据淘汰
    pageDataCache: Record<string, any>;
    loading: boolean;
  },
  any
> = {
  namespaced: true,
  state: () => ({
    pageDataCache: {},
    loading: false,
  }),
  mutations: {
    setPageData(state, { key, data }) {
      state.pageDataCache[key] = data || {};
    },
    setLoading(state, loading: boolean) {
      state.loading = !!loading;
    },
  },
};

export default module;
