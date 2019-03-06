import request from '@/utils/request';

export function fetchParam(name) {
  return request({
    url: '/sys/macros',
    method: 'post',
    params: {
      data: {
        name,
      },
    },
  });
}

export function getAppi() {

}
