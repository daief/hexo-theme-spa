// initial state
// shape: [{ id, quantity }]
const state = () => ({
  pageData: {},
});

// getters
const getters = {
  // cartProducts: (state, getters, rootState) => {
  //   return state.items.map(({ id, quantity }) => {
  //     const product = rootState.products.all.find(product => product.id === id);
  //     return {
  //       title: product.title,
  //       price: product.price,
  //       quantity,
  //     };
  //   });
  // },
  // cartTotalPrice: (state, getters) => {
  //   return getters.cartProducts.reduce((total, product) => {
  //     return total + product.price * product.quantity;
  //   }, 0);
  // },
};

// actions
const actions = {
  // checkout({ commit, state }, products) {
  //   const savedCartItems = [...state.items];
  //   commit('setCheckoutStatus', null);
  //   // empty cart
  //   commit('setCartItems', { items: [] });
  // },
  // addProductToCart({ state, commit }, product) {
  //   commit('setCheckoutStatus', null);
  //   if (product.inventory > 0) {
  //     const cartItem = state.items.find(item => item.id === product.id);
  //     if (!cartItem) {
  //       commit('pushProductToCart', { id: product.id });
  //     } else {
  //       commit('incrementItemQuantity', cartItem);
  //     }
  //     // remove 1 item from stock
  //     commit(
  //       'products/decrementProductInventory',
  //       { id: product.id },
  //       { root: true },
  //     );
  //   }
  // },
};

// mutations
const mutations = {
  setPageData(state, newData: any) {
    state.pageData = newData;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
