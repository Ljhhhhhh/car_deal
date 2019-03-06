export function hasClass(el, className) {
  const reg = new RegExp(`(^|\\s)${className}(\\s|$)`);
  return reg.test(el.className);
}

export function addClass(el, className) {
  if (hasClass(el, className)) {
    return;
  }

  const newClass = el.className.split(' ');
  newClass.push(className);
  el.className = newClass.join(' ');
}

export function removeClass(el, className) {
  if (!hasClass(el, className)) {
    return;
  }

  const reg = new RegExp(`(^|\\s)${className}(\\s|$)`);
  const classArr = el.className.split(' ');
  classArr.forEach((cls, index) => {
    if (reg.test(cls)) {
      classArr.splice(index, 1);
    }
  });
  el.className = classArr.join(' ');
  // let newClass = el.className.split(' ');
  // newClass.push(className);
  // el.className = newClass.join(' ');
}

export function getData(el, name, val) {
  const prefix = 'data-';
  name = prefix + name;
  if (val) {
    return el.setAttribute(name, val);
  }
  return el.getAttribute(name);
}

const elementStyle = document.createElement('div').style;

const vendor = (() => {
  const transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    o: 'oTransform',
    ms: 'msTransform',
    standard: 'Transform',
  };
  for (const key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }
  return false;
})();

export function prefixStyle(style) {
  if (vendor === false) {
    return false;
  }
  if (vendor === 'standard') {
    return style;
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}

function getStyle(obj, attr) {
  let val;
  if (obj.currentStyle) {
    val = obj.currentStyle[attr];
  } else {
    val = document.defaultView.getComputedStyle(obj, null)[attr];
  }
  return parseInt(val);
}

export function initScroll(parent, child, ...args) {
  const pH = parent.offsetHeight || parent.$el.offsetHeight;
  let moveH = 0;
  for (const arg of args) {
    if (arg) {
      const el = arg.$el || arg;
      const thisH = el.offsetHeight + getStyle(el, 'marginTop') + getStyle(el, 'marginBottom');
      moveH += thisH;
    }
  }
  const c = child.$el || child;
  const childM = getStyle(c, 'marginTop') + getStyle(c, 'marginBottom');
  const childH = pH - childM - moveH;
  c.style.height = `${childH}px`;
  c.style.overflow = 'hidden';
}
