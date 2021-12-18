// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import store from './store'
import App from './App'
import ElementUI from 'element-ui'
import VueParticles from 'vue-particles'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/index.css'
import '@/assets/js/iconfont.js'
import '@/assets/js/iconfont1.js'
import '@/assets/js/iconfont2.js'
import '@/assets/js/iconfont3.js'

Vue.use(Vuex);
Vue.use(ElementUI);
Vue.use(VueParticles);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  store: new Vuex.Store(store),
  render: h => h(App)
});
