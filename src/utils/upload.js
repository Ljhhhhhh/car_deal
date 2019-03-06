import axios from 'axios';
// import store from '@/store';
import cookie from 'js-cookie';
// import md5 from 'md5-node';
// import qs from 'qs';

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000, // request timeout
  // transformRequest: [function (data) {
  //   data = qs.stringify(data);
  //   console.log('data:', data);
  //   return data;
  // }],
});
// const SECRECT = '1234567890'; // y8q6wjtz3j1emtbwqnhipjgkpynpvmhh
// request interceptor
service.interceptors.request.use(
  (config) => {
    config.headers.crossorigin = 'web';
    // const params = JSON.stringify(config.params.data);
    // config.headers.sign = params ? md5(`${params}&${SECRECT}`) : md5(SECRECT);
    config.headers.token = cookie.get('token') || 'yhvn6d6olaqsmbq74mwcza80h58c7zu2'; // 暂时用这个，登录接口完成之后修改
    config.headers.type = 'B'; // 暂时用这个，登录接口完成之后修改
    config.headers['Content-Type'] = 'multipart/form-data';
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
