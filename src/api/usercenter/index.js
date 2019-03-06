import request from '@/utils/request';

export function setState(zt) {
  return request({
    url: '/bper/updateZt',
    method: 'POST',
    params: {
      data: {
        zt,
      },
    },
  });
}

export function getCode(phone) {
  return request({
    url: '/user/smscode',
    method: 'POST',
    params: {
      data: {
        phone,
      },
    },
  });
}

export function updateMobile(mobile, code) {
  return request({
    url: '/bper/updateMobile',
    method: 'POST',
    params: {
      data: {
        mobile,
        code,
      },
    },
  });
}

export function updatePassword(oldpwd, newpwd) {
  return request({
    url: '/bper/updatePwd',
    method: 'POST',
    params: {
      data: {
        oldpwd,
        newpwd,
      },
    },
  });
}

export function updatePasswordFromMobile(mobile, code, newpwd) {
  return request({
    url: '/bper/updatePwdByPhone',
    method: 'POST',
    params: {
      data: {
        mobile,
        code,
        newpwd,
      },
    },
  });
}

export function updateUsername(username) {
  return request({
    url: 'bper/updateUsername',
    method: 'POST',
    params: {
      data: {
        username,
      },
    },
  });
}

export function updateHeadpho(headpho) {
  return request({
    url: 'bper/updateHeadpho',
    method: 'POST',
    params: {
      data: {
        headpho,
      },
    },
  });
}
