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
  let sum = 20;
  arr.forEach((item, index) => {
    if (index < n) {
      sum += item.offsetWidth + 16;
    }
  });
  node.style.left = sum + 'px';
};
export const getIndex = (str) => {
  return str.slice(9);
};
