const router = [
  {
    path: '/order',
    name: 'order',
    component: () => import('@/pages/order/index'),
    meta: {
      title: '订单管理',
      parent: 0,
      role: ['admin'],
      icon: 'order',
    },
  },
  {
    path: '/order/newCarList',
    name: 'newCarOrderList',
    component: () => import('@/pages/order/newCarList'),
    meta: {
      title: '新车订单列表',
    },
  },
  {
    path: '/order/usedCarList',
    name: 'usedCarOrderList',
    component: () => import('@/pages/order/usedCarList'),
    meta: {
      title: '二手车订单列表',
    },
  },
  {
    path: '/order/rentList',
    name: 'rentOrderList',
    component: () => import('@/pages/order/rentList'),
    meta: {
      title: '租车订单列表',
    },
  },
  {
    path: '/order/cosmlist',
    name: 'cosmOrderlist',
    component: () => import('@/pages/order/cosmlist'),
    meta: {
      title: '洗美护订单列表',
    },
  },
  {
    path: '/order/orderDetail',
    name: 'orderDetail',
    component: () => import('@/pages/order/orderDetail'),
    meta: {
      title: '订单详情',
    },
  },
  {
    path: '/order/newCarOrder',
    name: 'newCarOrder',
    component: () => import('@/pages/order/newCarOrder'),
    meta: {
      title: '新建订单',
    },
  },
  {
    path: '/order/newUsedOrder',
    name: 'newUsedOrder',
    component: () => import('@/pages/order/newUsedOrder'),
    meta: {
      title: '新建二手车订单',
    },
  },
  {
    path: '/order/newRentOrder',
    name: 'newRentOrder',
    component: () => import('@/pages/order/newRentOrder'),
    meta: {
      title: '新建租车订单',
    },
  },
  {
    path: '/order/newCosmOrder',
    name: 'newCosmOrder',
    component: () => import('@/pages/order/newCosmOrder'),
    meta: {
      title: '新建洗美护订单',
    },
  },
];

export default router;
