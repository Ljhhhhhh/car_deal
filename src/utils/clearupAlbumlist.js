/**
 * 乱序的相册，根据图片所属类型排序
 */
export default function clearupList(albumlist = []) {
  const tabList = [];
  const newList = [];
  albumlist.forEach((album) => {
    const label = album.label;
    if (!tabList.includes(label)) {
      tabList.push(label);
    }
  });
  for (let i = 0, len = tabList.length; i < len; i++) {
    albumlist.forEach((album) => {
      if (album.label === tabList[i]) {
        newList.push(album);
      }
    });
  }
  return newList;
}
