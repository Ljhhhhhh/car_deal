import request from '@/utils/request';

export function fetchAreas() {
  return request({
    url: '/sys/areas',
    method: 'post',
    params: {
      data: {
        pId: 0,
      },
    },
  });
}
