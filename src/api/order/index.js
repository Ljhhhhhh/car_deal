import request from '@/utils/request';

export function addOrder({ phone, usrname, type, productId, usrid, financeId, city, mileage, deptId, days, startTime, endTime, total, deposit, discount, money, num }, id = null) {
  const data = {
    type,
    productId,
    usrid,
    financeId,
    city,
    mileage,
    deptId,
    days,
    startTime,
    endTime,
    total,
    deposit,
    discount,
    money,
    num,
    usrname,
    phone,
  };
  if (id) {
    data.id = id;
  }
  return request({
    url: '/bbiz/addTrade',
    method: 'post',
    params: {
      data,
    },
  });
}

export function tradeIndex() {
  return request({
    url: '/bbiz/trade_index',
    method: 'POST',
    params: {
      data: {},
    },
  });
}

export function tradeList(data) {
  return request({
    url: '/bbiz/trades',
    method: 'POST',
    params: {
      data,
    },
  });
}

export function tradeInfo(id) {
  return request({
    url: '/bbiz/tradeinfo',
    method: 'POST',
    params: {
      data: { id },
    },
  });
}

export function findNum(financeid) {
  return request({
    url: 'bbiz/queryFinanceByFinId',
    method: 'POST',
    params: {
      data: { financeid },
    },
  });
}

export function deleteOrder(id) {
  return request({
    url: 'bbiz/deltrade',
    method: 'POST',
    params: {
      data: { id },
    },
  });
}

export function acceptOrder(id) {
  return request({
    url: 'bbiz/handle',
    method: 'POST',
    params: {
      data: { id },
    },
  });
}
