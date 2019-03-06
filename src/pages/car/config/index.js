import cookie from 'js-cookie';

export const carStatusMap = [
  {
    key: 0,
    name: '闲置中',
  },
  {
    key: 1,
    name: '待售中',
  },
  {
    key: 2,
    name: '租赁中',
  },
  {
    key: 3,
    name: '已出库',
  },
  {
    key: 4,
    name: '自用',
  },
];
export const uploadConfig = {
  options: {
    // https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js
    target: 'http://testapi.chetianyi.com/api/upload/upload?lx="carpath"',
    testChunks: false,
    headers: {
      type: 'B',
      token: cookie.get('token'),
      crossorigin: 'web',
    },
  },
  attrs: {
    accept: 'image/*',
  },
};
