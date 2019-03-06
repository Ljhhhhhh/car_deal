const router = [
  {
    path: '/staff',
    name: 'Staff',
    component: () => import('@/pages/staff'),
    meta: {
      title: '员工管理',
      icon: 'staff',
      parent: 0,
      role: ['admin', 'editor'],
    },
  },
  {
    path: '/staff/detail',
    name: 'staffDetail',
    component: () => import('@/pages/staff/detail'),
    meta: {
      title: '员工详情',
    },
  },
];

export default router;
