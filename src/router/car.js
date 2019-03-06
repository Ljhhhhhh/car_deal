const router = [
  {
    path: '/car',
    name: 'Car',
    component: () => import('@/pages/car'),
    meta: {
      title: '车辆管理',
      role: ['admin', 'editor'],
      parent: 0,
      icon: 'car',
    },
  },
  {
    path: '/car/list',
    name: 'carList',
    component: () => import('@/pages/car/list'),
    meta: {
      title: '车辆列表',
      role: ['admin', 'editor'],
    },
  },
  {
    path: '/car/addCar',
    name: 'addCar',
    component: () => import('@/pages/car/addCar'),
    meta: {
      title: '新增车辆',
      role: ['admin', 'editor'],
    },
  },
  {
    path: '/car/typeinList',
    name: 'typeinList',
    component: () => import('@/pages/car/typeinList'),
    meta: {
      title: '入库列表',
      role: ['admin', 'editor'],
    },
  },
  {
    path: '/car/stockOutList',
    name: 'stockOutList',
    component: () => import('@/pages/car/stockOutList'),
    meta: {
      title: '出库列表',
      role: ['admin', 'editor'],
    },
  },
  {
    path: '/car/typein',
    name: 'carTypein',
    component: () => import('@/pages/car/typein'),
    meta: {
      title: '车辆入库',
      role: ['admin'],
    },
  },
  {
    path: '/car/stockout',
    name: 'carStockOut',
    component: () => import('@/pages/car/stockOut'),
    meta: {
      title: '车辆出库',
      role: ['admin'],
    },
  },
  {
    path: '/car/detail/:id',
    name: 'carDetail',
    component: () => import('@/pages/car/detail'),
    meta: {
      title: '车辆详情',
      role: ['admin', 'editor'],
    },
  },
  {
    path: '/car/info/:id/:program',
    name: 'carInfo',
    component: () => import('@/pages/car/info'),
    meta: {
      title: '车辆详情',
      role: ['admin', 'editor'],
    },
  },
  {
    path: '/car/selectlist',
    name: 'selectList',
    component: () => import('@/pages/car/selectlist'),
    meta: {
      title: '车辆选择',
      role: ['admin', 'editor'],
    },
  },
];

export default router;
