import request from '@/utils/request';

export function getAppid(url) {
  return request({
    url: '/auth/getWxAppId',
    method: 'post',
    params: {
      data: {
        url,
      },
    },
  });
}

export function getAppi() {

}
