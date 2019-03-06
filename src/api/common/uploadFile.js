import axios from 'axios';

const config = {
  headers: {
    'Content-Type': 'multipart/form-data',
    type: 'B',
    crossorigin: 'web',
  },
};

const headConfig = {
  headers: {
    type: 'B',
    crossorigin: 'web',
  },
};

export default function uploadFile(name, fileData) {
  return axios.post(`http://testapi.chetianyi.com/api/upload/upload?lx=tradepath&name=${name}`, fileData, config).then(response => response.data);
}

export function uploadHeadpho(lx, name, fileData) {
  return axios.post(
    `http://testapi.chetianyi.com/api/upload/upload?lx=${lx}&name=${name}`,
    fileData,
    headConfig,
  ).then(response => response.data);
}

export function uploadMsgPhoto(fileData) {
  return axios.post(
    'http://testapi.chetianyi.com/api/upload/upload?lx=2',
    fileData,
    config,
  ).then(response => response.data);
}
