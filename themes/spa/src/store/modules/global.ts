import { Module } from 'vuex';

const module: Module<
  {
    pageData: any;
    loading: boolean;
  },
  any
> = {
  namespaced: true,
  state: () => ({
    pageData: {},
    loading: false,
  }),
  mutations: {
    setPageData(state, newData: any) {
      state.pageData = newData;
    },
    setLoading(state, loading: boolean) {
      state.loading = !!loading;
    },
  },
};

export default module;
