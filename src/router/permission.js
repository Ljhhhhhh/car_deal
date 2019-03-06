import router from './index';
import store from '@/store/index';
import cookie from 'js-cookie';
import { Toast } from 'vant';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// import Vue from 'vue';
// import VueSocketio from 'vue-socket.io';

NProgress.configure({ showSpinner: false });

const getVal = (val) => {
  const data = typeof val === 'function' ? val() : val;
  return data;
};

const hideHeader = () => {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = '.mint-header.header{display:none}';
  document.getElementsByTagName('HEAD').item(0).appendChild(style);
};

const openOrigin = () => {
  /**
   * app: 来源 IOS还是ANDROID
   * userinfo: 用户信息
   * token: 用户token
   * role: 用户所属角色 例如：'admin'
   */
  // window.APPDATA = {
  //   app: () => ('ANDROID'), // 'ANDROID'
  //   getUserInfo: () => ({ name: 'ljh' }), // {name: 'ljh'}
  //   token: 'this is token', // () => ('this is token')
  //   role: 'admin',
  // };
  if (window.APPDATA && window.APPDATA.app) {
    const value = getVal(window.APPDATA.app);
    store.commit('SET_ORIGIN', value);
    hideHeader();
    if (window.APPDATA.token) {
      store.commit('SET_TOKEN', getVal(window.APPDATA.token));
    }
    if (window.APPDATA.role) {
      store.commit('SET_ROLE', getVal(window.APPDATA.role));
    }
    if (window.APPDATA && window.APPDATA.getUserInfo) {
      const data = getVal(window.APPDATA.getUserInfo);
      const userinfo = typeof data === 'object' ? data : JSON.parse(data);
      store.commit('SET_USERINFO', userinfo);
    }
  } else {
    if (!store.state.token) {
      store.commit('SET_TOKEN', cookie.get('token'));
    }
    if (!store.state.role) {
      store.commit('SET_ROLE', cookie.get('role'));
    }
  }
};

router.beforeEach((to, from, next) => {
  openOrigin();
  NProgress.start();
  const { token, role } = store.state;
  if (to.name === 'Login') {
    next();
    NProgress.done();
  } else if ((!token || !role) && to.name !== 'Login') {
    next({ name: 'Login' });
    NProgress.done();
  } else {
    const allowRole = to.meta.role;
    if (allowRole && !allowRole.includes(role)) {
      Toast.fail('暂无权限');
    } else {
      document.title = to.meta && to.meta.title ? to.meta.title : '人车人后台管理';
      if (!store.state.userinfo || !store.state.userinfo.id) {
        store.dispatch('setUserinfo').then(() => {
          next();
          NProgress.done();
        });
      } else {
        next();
        NProgress.done();
      }
    }
  }
});
