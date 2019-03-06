import {
  getCode,
  getOpenid,
  getUserinfo,
} from '@/api/user/index';
import cookie from 'js-cookie';
import store from '@/store';

function getCodeFunc() {
  let callbackUrl;
  getCode(window.location.href).then((res) => {
    callbackUrl = res.data.resultUrl;
  }).then(() => {
    window.location.href = callbackUrl;
  });
}

function wxLoginFunc(query) {
  // const query = this.$route.query;
  const code = query.code;
  getOpenid(code).then((d) => {
    const validity = d.data.expire / 60 / 60 / 24;
    cookie.set('openid', d.data.openid);
    cookie.set('token', d.data.token, {
      expires: validity,
    });
  }).then(() => {
    getUserinfoFunc();
  }).catch((err) => {
    console.error(err);
  });
}

function getUserinfoFunc() {
  getUserinfo().then((res) => {
    console.log('getuserinfo:', res);
    // this.userinfo = res.data
    // this.setUserinfo(res.data);
    store.commit('userinfo', res.data);
    cookie.set('usrId', res.data.usrId);
    // if (res.errno === 1) {
    //   this.getCode()
    // }
  });
}

function loginByWechat(query) {
  const openid = cookie.get('openid');
  if (!openid && !query.code) {
    getCodeFunc();
  } else if (query.code && !cookie.get('openid')) {
    wxLoginFunc(query);
  } else {
    getUserinfoFunc();
  }
}

export default loginByWechat;
