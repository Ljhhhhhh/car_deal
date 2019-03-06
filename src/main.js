// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vant, { Lazyload } from 'vant';
import App from './App';
import FastClick from 'fastclick';
import * as filters from './filters'; // global filters
import store from './store';
import router from './router';
import uploader from 'vue-simple-uploader';
// eslint-disable-next-line
import Icon from 'vue-svg-icon/Icon.vue';
import './router/permission';
import { Header, Button, Swipe, SwipeItem, Field, DatetimePicker } from 'mint-ui';
import VueQuickLoadmore from 'vue-quick-loadmore';
import 'vant/lib/index.css';

// eslint-disable-next-line
import 'static/styles/main.scss';

Vue.config.productionTip = false;

Vue.use(Vant);
Vue.use(Lazyload);
Vue.use(uploader);
Vue.use(VueQuickLoadmore);

FastClick.attach(document.body);

Vue.component('icon', Icon);
Vue.component(Header.name, Header);
Vue.component(Button.name, Button);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Field.name, Field);
Vue.component(DatetimePicker.name, DatetimePicker);

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
