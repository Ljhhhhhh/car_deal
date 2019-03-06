import request from '@/utils/request';

export function fetchBrands() {
  return request({
    url: '/car/index/brandlist',
    method: 'post',
    params: {},
  });
}
