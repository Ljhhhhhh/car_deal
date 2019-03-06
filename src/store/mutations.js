import * as types from './mutation-types';

const matutaions = {
  [types.SET_ORIGIN](state, origin) {
    state.origin = origin;
  },
  [types.SET_USERINFO](state, userinfo) {
    state.userinfo = userinfo;
  },
  [types.SET_TOKEN](state, token) {
    state.token = token;
  },
  [types.SET_MENUS](state, menus) {
    state.menus = menus;
  },
  [types.SET_ROLE](state, role) {
    state.role = role;
  },
  SOCKET_message_event(state, msg) {
    console.log(msg, '你好啊！！！！！！！！！！！！');
    state.msgList.push(msg);
  },
};

export default matutaions;
