import cookie from 'js-cookie';
import upload from '@/utils/upload';

const uploadConfig = {
  options: {
    // https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js
    target: 'http://testapi.chetianyi.com/api/upload/upload?lx=carpath',
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
  document: {
    options: {
      target: 'http://testapi.chetianyi.com/api/upload/upload?lx=tradepath',
      testChunks: false,
      headers: {
        type: 'B',
        token: cookie.get('token'),
        crossorigin: 'web',
      },
    },
    attrs: {
      accept: 'application/msword, application/vnd.ms-excel',
    },
  },

  uploadFunc() {
    return upload({
      url: '/sys/usrs',
      method: 'post',
      params: {
        data: {

        },
      },
    });
  },
};

export default uploadConfig;
