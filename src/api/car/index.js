import request from '@/utils/request';

export function fetchCar({ lx, page = 1, key = '', size = 5 }) {
  return request({
    url: '/lscar/list/',
    method: 'post',
    params: {
      data: {
        page,
        size,
        lx,
        key,
      },
    },
  });
}

/**
 * 车辆详情
 */

export function carDetail(id) {
  return request({
    url: '/lscar/info',
    method: 'post',
    params: {
      data: {
        id,
      },
    },
  });
}

export function fetchSuppliers() {
  return request({
    url: '/user/suppliers',
    method: 'post',
    params: {
      data: {
        page: 1,
        size: 20,
      },
    },
  });
}

export function fetchPark() {
  return request({
    url: '/lsposition/list',
    method: 'post',
    params: {
      data: {
        page: 1,
        size: 20,
      },
    },
  });
}

/**
 * 出库列表
 */
export function fetchStockout({ page = 1, key = '', size = 5 }) {
  return request({
    url: '/lsost/list',
    method: 'post',
    params: {
      data: {
        page,
        size,
        key,
      },
    },
  });
}

/**
 * 新增出库
 */

export function stockout({
  carId,
  osterId,
  managerId,
  remark,
  uploads,
  lx,
}, id) {
  let data = {};
  if (id) {
    data = {
      carId,
      osterId,
      managerId,
      remark,
      uploads,
      lx,
      id,
    };
  } else {
    data = {
      carId,
      osterId,
      managerId,
      remark,
      uploads,
      lx,
    };
  }
  return request({
    url: '/lsost/add',
    method: 'post',
    params: {
      data,
    },
  });
}

/**
 * 出库明细
 */
export function stockoutDetail(id) {
  return request({
    url: 'lsost/info',
    method: 'post',
    params: {
      data: {
        id,
      },
    },
  });
}

/**
 * 入库明细
 */

export function typeinDetail(id) {
  return request({
    url: '/lsist/info',
    method: 'POST',
    params: {
      data: {
        id,
      },
    },
  });
}

/**
 * 入库列表
 */
export function fetchTypein({ page = 1, key = '', size = 5 }) {
  return request({
    url: '/lsist/list',
    method: 'post',
    params: {
      data: {
        page,
        size,
        key,
      },
    },
  });
}

/**
 * 新增入库
 */
export function typein({ carId, color, frameNo, gysId, mileage, origin, platNo, uploads, positionId, lx = '1' }, id) {
  return request({
    url: '/lsist/add',
    method: 'post',
    params: {
      data: {
        carId,
        color,
        frameNo,
        gysId,
        mileage,
        origin,
        platNo,
        uploads,
        positionId,
        lx,
        id,
      },
    },
  });
}

/**
 * 汽车品牌列表
 */
export function fetchCarBrand() {
  return request({
    url: 'car/index/brandlist',
    method: 'POST',
    params: {
      data: {
      },
    },
  });
}

/**
 * 根据车辆品牌寻找车系列表
 */
export function fetchCarSeries(brandId) {
  return request({
    url: 'car/index/serieslist',
    method: 'POST',
    params: {
      data: {
        brandId,
      },
    },
  });
}

/**
 * 根据车辆品牌寻找车系列表
 */
export function fetchCarMode(seriesId) {
  return request({
    url: 'car/index/modelist',
    method: 'POST',
    params: {
      data: {
        seriesId,
      },
    },
  });
}

/**
 * 新增车辆
 */
export function addCar({
  uploads,
  carimgs,
  frameNo,
  mileage,
  modeId,
  name,
  colors,
  type,
  mprice,
  price,
  bprice,
  share,
  remark,
  auth,
}, id = null) {
  const data = {
    uploads,
    carimgs,
    frameNo,
    mileage,
    modeId,
    name,
    colors,
    type,
    mprice,
    price,
    bprice,
    share: share ? 1 : 0,
    remark,
    auth,
  };
  if (id) {
    data.id = id;
  }
  return request({
    url: '/lscar/add',
    method: 'post',
    params: {
      data,
    },
  });
}
