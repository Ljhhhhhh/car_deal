import axios from 'axios';
// import md5 from 'md5-node';
// import CryptoJs from 'crypto-js';
import store from '../store';
import cookie from 'js-cookie';
import { Toast } from 'vant';
// eslint-disable-next-line
import { AES_Encrypt } from './util';

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000,

  paramsSerializer(params) {
    console.log('params:', JSON.stringify(params.data));
    params.data.aesTime = Date.now();
    return `data=${AES_Encrypt(JSON.stringify(params.data))}`;
  },
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    config.headers.crossorigin = 'web';
    config.headers.token = store.state.token; // 暂时用这个，登录接口完成之后修改
    config.headers.type = 'B'; // 暂时用这个，登录接口完成之后修改
    // }
    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  },
);

// response interceptor
service.interceptors.response.use(
  // response => response.data,
  (response) => {
    const res = response.data;
    if (res.errno !== 0) {
      console.warn('获取数据可能存在错误，返回code不为200');
      if (res.errno === 402) {
        cookie.remove('token');
        Toast.fail('请登录');
        // window.location.href = '/';
      } else if (res.errmsg !== '帐号不存在' && res.errmsg !== '密码错误') {
        Toast.fail(res.errmsg || '网络错误，请重试');
      }
      return res;
    }
    return res;
  },
  (error) => {
    console.log(`err${error}`); // for debug
    return Promise.reject(error);
  },
);

export default service;
