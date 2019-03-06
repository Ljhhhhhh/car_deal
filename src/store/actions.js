import * as types from './mutation-types';
import { fetchMenus } from '@/api/common';
import { getUserinfo } from '@/api/common/users';

export function setMenus({ commit }) {
  return new Promise((resolve, reject) => {
    fetchMenus().then((d) => {
      commit(types.SET_MENUS, d.data.rows);
      resolve(d.data.rows);
    }).catch((err) => {
      reject(err);
    });
  });
}

export function setUserinfo({ commit }) {
  return new Promise((resolve, reject) => {
    getUserinfo().then((d) => {
      commit(types.SET_USERINFO, d.data);
      setTimeout(() => {
        resolve();
      }, 200);
    }).catch((err) => {
      reject(err);
    });
  });
}
