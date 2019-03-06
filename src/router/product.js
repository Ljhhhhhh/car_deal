const router = [
  {
    path: '/product',
    name: 'product',
    component: () => import('@/pages/product'),
    meta: {
      title: '汽车销售',
      icon: 'sale',
      parent: 0,
      role: ['admin'],
    },
  },
  {
    path: '/product/newCar',
    name: 'newCar',
    component: () => import('@/pages/product/newCar'),
    meta: {
      title: '新增新车',
    },
  },
  {
    path: '/product/newUsedCar',
    name: 'newUsedCar',
    component: () => import('@/pages/product/newUsedCar'),
    meta: {
      title: '新增二手车',
    },
  },
  {
    path: '/product/newCosm',
    name: 'newCosm',
    component: () => import('@/pages/product/newCosm'),
    meta: {
      title: '新增汽车服务',
    },
  },
  {
    path: '/product/newRentCar',
    name: 'newRentCar',
    component: () => import('@/pages/product/newRentCar'),
    meta: {
      title: '新增出租车辆',
    },
  },
  {
    path: '/product/newCarList',
    name: 'newCarList',
    component: () => import('@/pages/product/newCarList'),
    meta: {
      title: '新车管理',
    },
  },
  {
    path: '/product/usedCarList',
    name: 'usedCarList',
    component: () => import('@/pages/product/usedCarList'),
    meta: {
      title: '二手车管理',
    },
  },
  {
    path: '/product/rentCarList',
    name: 'rentCarList',
    component: () => import('@/pages/product/rentCarList'),
    meta: {
      title: '租车管理',
    },
  },
  {
    path: '/product/cosmList',
    name: 'cosmList',
    component: () => import('@/pages/product/cosmList'),
    meta: {
      title: '洗美护管理',
    },
  },
  {
    path: '/product/ruleSearch',
    name: 'ruleSearch',
    component: () => import('@/pages/product/ruleSearch'),
    meta: {
      title: '违章查询',
    },
  },
  {
    path: '/product/ruleSearch/ruleInfo',
    name: 'ruleInfo',
    component: () => import('@/pages/product/ruleInfo'),
    meta: {
      title: '违章情况',
    },
  },
];

export default router;

