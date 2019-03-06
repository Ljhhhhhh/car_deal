import request from '@/utils/request';

export function fetchUsers() {
  return request({
    url: '/sys/usrs',
    method: 'post',
    params: {
      data: {

      },
    },
  });
}

/**
 * 获取手机验证码
 */
export function getVerify(phone) {
  return request({
    url: '/user/smscode',
    method: 'post',
    params: {
      data: {
        phone,
      },
    },
  });
}

/**
 * 登录
 */
export function login({ account, password }) {
  return request({
    url: '/auth/syslogin',
    method: 'post',
    params: {
      data: {
        account,
        password,
      },
    },
  });
}

// bper/info

/**
 * 登录
 */
export function getUserinfo() {
  return request({
    url: '/user/binfo',
    method: 'post',
    params: {
      data: {
      },
    },
  });
}
