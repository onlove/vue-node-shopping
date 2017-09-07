// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import VueInfiniteScroll from  'vue-infinite-scroll'
import Vuex from  'vuex'
Vue.config.productionTip = false


import "./assets/css/base.css";
import './assets/css/checkout.css';
import './assets/css/product.css';

Vue.use(VueLazyLoad, {
  loading: require('../static/loading-svg/loading-bars.svg')
});
Vue.use(VueInfiniteScroll);
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: {
    updateUserInfo (state, nickName) {
      state.nickName = nickName
    },
    updateCartCount (state, cartCount) {
      state.cartCount += cartCount;
    },
    initCartCount (state, cartCount) {
      state.cartCount = cartCount;
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
