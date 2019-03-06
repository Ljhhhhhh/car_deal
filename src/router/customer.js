const router = [
  {
    path: '/customer',
    name: 'Customer',
    component: () => import('@/pages/customer'),
    meta: {
      title: '客户管理',
      parent: 0,
      role: ['admin'],
      icon: 'customer',
    },
  },
  {
    path: '/customer/add',
    name: 'AddCustomer',
    component: () => import('@/pages/customer/add'),
    meta: {
      title: '新增客户',
    },
  },
  {
    path: '/customer/detail',
    name: 'CustomerDetail',
    component: () => import('@/pages/customer/detail'),
    meta: {
      title: '客户详情',
      role: ['admin'],
    },
  },
  {
    path: '/customer/rentrecord',
    name: 'rentRecord',
    component: () => import('@/pages/customer/rentRecord'),
    meta: {
      title: '租车记录',
    },
  },
  // rentRecord
];

export default router;
