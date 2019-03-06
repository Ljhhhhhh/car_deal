import request from '@/utils/request';

export function business({ page = 1, size = 20 } = {}) {
  return request({
    url: '/bbiz/index/',
    method: 'post',
    params: {
      data: {
        page,
        size,
      },
    },
  });
}

/**
 * 订单明细
 */
export function tradeDetail(id) {
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

/**
 * 业务表明细
 */
export function tablesDetail(parentId, tradeId) {
  return request({
    url: '/bbiz/business/',
    method: 'post',
    params: {
      data: {
        parentId,
        tradeId,
      },
    },
  });
}

/**
 * 新增/修改业务表
 */
export function handleBusiness(table, tradeId, columns) {
  return request({
    url: '/bbiz/saveBusiness/',
    method: 'post',
    params: {
      data: {
        table,
        tradeId,
        columns,
      },
    },
  });
}
