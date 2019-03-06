const router = [
  {
    path: '/usercenter',
    name: 'usercenter',
    component: () => import('@/pages/usercenter'),
    meta: {
      title: '个人中心',
      icon: 'staff',
      parent: 0,
      role: ['admin', 'editor'],
    },
  },
  {
    path: '/usercenter/about',
    name: 'usercenterAbout',
    component: () => import('@/pages/usercenter/about'),
    meta: {
      title: '关于人车人',
    },
  },
  {
    path: '/usercenter/safe',
    name: 'usercenterSafe',
    component: () => import('@/pages/usercenter/safe'),
    meta: {
      title: '安全设置',
    },
  },
  {
    path: '/usercenter/phone',
    name: 'usercenterPhone',
    component: () => import('@/pages/usercenter/phone'),
    meta: {
      title: '修改手机号',
    },
  },
  {
    path: '/usercenter/password',
    name: 'usercenterPassword',
    component: () => import('@/pages/usercenter/password'),
    meta: {
      title: '密码修改',
    },
  },
  {
    path: '/usercenter/info',
    name: 'usercenterInfo',
    component: () => import('@/pages/usercenter/info'),
    meta: {
      title: '个人资料',
    },
  },
];

export default router;
