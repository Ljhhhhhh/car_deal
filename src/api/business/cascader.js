import request from '@/utils/request';

export function getOptions(url, id) {
  return request({
    url,
    method: 'post',
    params: {
      data: {
        id,
      },
    },
  });
}

/**
 * 订单明细
 */
export function d(id) {
  return request({
    url: '/bbiz/tradeinfo/',
    method: 'post',
    params: {
      data: {
        id,
      },
    },
  });
}
