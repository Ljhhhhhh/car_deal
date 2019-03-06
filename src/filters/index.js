import dayjs from 'dayjs';

export function padStartIndex(index, list) {
  const pad = (`${list.length}`).split('').length;
  return (`${index}`).padStart(pad, 0);
}
export function formatPrice(price) {
  let p;
  if (price > 10000) {
    p = `${(price / 10000).toFixed(2)}万`;
  }
  return p;
}

export function formatTime(time) {
  return dayjs(time).format('MM-DD HH:mm:ss');
}

export function formatMile(mile) {
  if (!mile) {
    return '未知';
  }
  let m = '';
  if (Number(mile) > 1000) {
    m = `${(mile / 1000).toFixed(2)}K`;
  } else {
    m = mile;
  }
  m += 'm';
  return m;
}
