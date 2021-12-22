/**
 * 请不要改动此文件，否则更新配置会造成你的改动被覆盖
 **/
import Vue from 'vue'
import App from './App'
import router from './router/router'
import $util from '@/../resource/js/$util'
import '@/../resource/assets/scss/mixin.scss'
import { ToastPlugin, LoadingPlugin, AlertPlugin, ConfirmPlugin, DatetimePlugin } from 'vux'
import $storage from '@/../resource/js/storage'
import cryptoJs from '@/../resource/js/crypto-min'
import Vuex from 'vuex'
import vuex_modules from '../vuex'
import 'leaflet/dist/leaflet.css';

import videoJs from 'video.js';
import 'video.js/dist/video-js.css';
window.videojs = videoJs;
require('../node_modules/video.js/dist/lang/zh-CN.js');

window.$util = $util;
window.$storage = $storage;

// import vConsole from 'vconsole';
// new vConsole();

Vue.config.productionTip = false;

Vue.use(ToastPlugin, {position: 'top', time: 3000});
Vue.use(LoadingPlugin);
Vue.use(AlertPlugin);
Vue.use(ConfirmPlugin);
Vue.use(cryptoJs);
Vue.use(DatetimePlugin);
Vue.use(Vuex);

import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
Vue.use(MuseUI);

const store = new Vuex.Store({
  modules: vuex_modules
})

let vue = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  // components: { App },
  template: '<App/>'
});
