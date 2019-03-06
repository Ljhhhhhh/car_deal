import Vue from 'vue';
import Router from 'vue-router';
import business from './business';
import product from './product';
import customer from './customer';
import order from './order';
import car from './car';
import staff from './staff';
import usercenter from './usercenter';

Vue.use(Router);

const defaultRoutes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/pages/login'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/register'),
    meta: {
      title: '注册',
    },
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('@/pages/index'),
    meta: {
      title: '首页',
    },
  },
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('@/pages/demo'),
    meta: {
      title: 'demo',
    },
  },
];
const routes = defaultRoutes.concat(car, business, product, customer, order, staff, usercenter);
export default new Router({
  routes,
});
