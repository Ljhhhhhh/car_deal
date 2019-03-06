import request from '@/utils/request';

export default ({ page, size }) => request({
  url: '/lscar/list/',
  method: 'post',
  params: {
    data: {
      page,
      size,
    },
  },
});
