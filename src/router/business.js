const router = [
  {
    path: '/business',
    name: 'Business',
    component: () => import('@/pages/business'),
    meta: {
      title: '业务管理',
      icon: 'business',
      parent: 0,
      role: ['admin', 'editor'],
    },
  },
  {
    path: '/business/info',
    name: 'BusinessInfo',
    component: () => import('@/pages/business/info'),
    meta: {
      title: '完善资料',
    },
  },
  {
    path: '/business/detail',
    name: 'BusinessDetail',
    component: () => import('@/pages/business/detail'),
    meta: {
      // title: '详情明细',
    },
  },
  {
    path: '/business/chat',
    name: 'BusinessChat',
    component: () => import('@/pages/business/chat'),
    meta: {
      // title: '详情明细',
    },
  },
];

export default router;
