export const addLoadEvent = (func) => {
  if (typeof window.onload !== 'function') {
    window.onload = func;
  } else {
    const oldOnload = window.onload;
    window.onload = () => {
      oldOnload();
      func();
    };
  }
};
export const getN = (arr, node, n) => {
  node.style.width = arr[n].offsetWidth + 'px';
  node.style.left = arr[n].offsetLeft + 'px';
};
export const getIndex = (str) => {
  return str.slice(9);
};
export const flat = (arr) => {
  let copyArr = arr.slice();
  while (copyArr.some(arg => {
    return Array.isArray(arg)
  })) {
    copyArr = [].concat(...copyArr)
  }
  return copyArr;
}
