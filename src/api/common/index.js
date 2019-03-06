import request from '@/utils/request';

export function fetchMenus() {
  return request({
    url: '/sys/menus',
    method: 'post',
    params: {
      data: {},
    },
  });
}

export function messagesHistory({ toId, page = 1, size = 20 }) {
  return request({
    url: '/sys/messages',
    method: 'post',
    params: {
      data: {
        toId,
        page,
        size,
      },
    },
  });
}
