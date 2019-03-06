const webAction = (args) => {
  try {
    window.webkit.messageHandlers.webAction.postMessage(args);
  } catch (error) {
    console.log(`window.webkit.messageHandlers.hello.postMessage('${args}')`);
    console.log('WKWebView post message');
  }
};
// webAction({
//   type: 'alert',
//   message: 'message',
// });
const OsAction = (...args) => {
  // console.log(args[0], args[1]);
  const func = args.shift();
  window[func] = args[0];
  // if (typeof func === 'function') {
  //   window[func]();
  // }
};

// const getUserInfo = (string) => {
//   let arrs = string.split('@');
//   if (!arrs.length) return;
//   let userToken = arrs[0];
//   console.log(userToken);
//   window.userToken = userToken;
// };
export {
  webAction,
  OsAction,
  // getUserInfo,
};
