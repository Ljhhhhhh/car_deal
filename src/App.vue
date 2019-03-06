<template>
  <div id="app">
    <transition name="fade">
      <router-view />
    </transition>
  </div>
</template>

<script>
// import { mapMutations } from 'vuex';
// import cookie from 'js-cookie';

export default {
  name: 'App',
  // },
  // methods: {

  //   openOrigin() {
  //     /**
  //      * app: 来源 IOS还是ANDROID
  //      * userinfo: 用户信息
  //      * token: 用户token
  //      */
  //     // window.APPDATA = {
  //     //   app: () => ('ANDROID'), // 'ANDROID'
  //     //   getUserInfo: () => ({ name: 'ljh' }), // {name: 'ljh'}
  //     //   token: '', // () => ('this is token')
  //     // };
  //     if (window.APPDATA && window.APPDATA.app) {
  //       const value = this.getVal(window.APPDATA.app);
  //       this.setOrigin(value);
  //       this.hideHeader();
  //       if (window.APPDATA.token) {
  //         this.setToken(this.getVal(window.APPDATA.token));
  //         // cookie.set('token', this.getVal(window.APPDATA.token));
  //       }
  //       if (window.APPDATA && window.APPDATA.getUserInfo) {
  //         const data = this.getVal(window.APPDATA.getUserInfo);
  //         const userinfo = typeof data === 'object' ? data : JSON.parse(data);
  //         this.setUserInfo(userinfo);
  //       } else {
  //         this.setToken(cookie.get('token'));
  //       }
  //     }
  //   },
  //   getVal(val) {
  //     const data = typeof val === 'function' ? val() : val;
  //     return data;
  //   },
  //   hideHeader() {
  //     const style = document.createElement('style');
  //     style.type = 'text/css';
  //     style.innerHTML = '.mint-header.header{display:none}';
  //     document.getElementsByTagName('HEAD').item(0).appendChild(style);
  //   },
  //   ...mapMutations({
  //     setOrigin: 'SET_ORIGIN',
  //     setUserInfo: 'SET_USERINFO',
  //     setToken: 'SET_TOKEN',
  //   }),
  // },
};

</script>
