import request from '@/utils/request';

export function fetchTab(date) {
  return request({
    url: '/bgds/product_index',
    method: 'POST',
    params: {
      data: {
        date,
      },
    },
  });
}

export function ChooseCarList() {
  return request({
    url: '/bgds/cars',
    method: 'POST',
    params: {
      data: {},
    },
  });
}

export function newVehicle({
  carId,
  deposit,
  financeIds,
  lx,
  mprice,
  payment,
  price,
  title,
  tags,
  acts,
  share,
  uploads,
}, id) {
  let data = {};
  if (id) {
    data = {
      carId,
      deposit,
      financeIds,
      lx,
      mprice,
      payment,
      price,
      title,
      tags,
      acts,
      share,
      uploads,
      id,
    };
  } else {
    data = {
      carId,
      deposit,
      financeIds,
      lx,
      mprice,
      payment,
      price,
      title,
      tags,
      share,
      acts,
      uploads,
    };
  }
  return request({
    url: '/bgds/saveNew',
    method: 'POST',
    params: {
      data,
    },
  });
}

export function fentchFinances() {
  return request({
    url: 'bgds/finances',
    method: 'POST',
    params: {
      data: {},
    },
  });
}

export function fentchActs() {
  return request({
    url: 'bgds/acts',
    method: 'POST',
    params: {
      data: {},
    },
  });
}

export function productInfo(id) {
  return request({
    url: 'bgds/info',
    method: 'POST',
    params: {
      data: { id },
    },
  });
}


export function fentchProducts({
  lx,
  page = 1,
  searchText = '',
  size = 5,
}) {
  return request({
    url: 'bgds/products',
    method: 'POST',
    params: {
      data: {
        page,
        size,
        lx,
        searchText,
      },
    },
  });
}

// 违章
export function seachRule(platNo, vin, engineNo) {
  return request({
    url: 'usr/car300/wz',
    method: 'POST',
    params: {
      data: {
        vin,
        platNo,
        engineNo,
      },
    },
  });
}
