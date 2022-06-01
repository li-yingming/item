// 1 获取节点
let boxObj = document.querySelector('#box');
let smallObj = document.querySelector('#small');
// 获取小黄块
let maskObj = document.querySelector('#mask');
let bigObj = document.querySelector('#big');
let bigImg = document.querySelector('#img');

// 2 给小图绑定鼠标移入和移出事件
smallObj.onmouseenter = function () {
  // 2-1 显示小黄块和大图
  maskObj.style.display = 'block';
  bigObj.style.display = 'block';
}

// 3 移走则隐藏大图和小黄块
smallObj.onmouseleave = function () {
  // 2-1 显示小黄块和大图
  maskObj.style.display = 'none';
  bigObj.style.display = 'none';
}


// 4 给小图绑定鼠标移动事件
smallObj.onmousemove = function (eve) {
  // 计算小黄块能够移动的最大left和top
  // console.log(smallObj.offsetHeight, maskObj.offsetHeight);

  let maxLeft = smallObj.offsetWidth - maskObj.offsetWidth;
  let maxTop = smallObj.offsetHeight - maskObj.offsetHeight;

  // 4-1 获取鼠标的相对于可视区坐标
  // let cx = eve.clientX;
  // let cy = eve.clientY;
  let cx = eve.pageX;
  let cy = eve.pageY;
  //4-2 获取div#box的坐标
  let boxLeft = boxObj.offsetLeft;
  let boxTop = boxObj.offsetTop;

  let tmpx = cx - boxLeft - maskObj.offsetWidth / 2;
  let tmpy = cy - boxTop - maskObj.offsetHeight / 2;
  // 4-3 判断上边界和左边界值不能小于0
  if (tmpx < 0) tmpx = 0;
  if (tmpy < 0) tmpy = 0
  // 判断是否从右边界和下边界超出
  // console.log(tmpx, maxLeft);
  console.log(tmpy, maxTop);

  if (tmpx > maxLeft) tmpx = maxLeft
  if (tmpy > maxTop) tmpy = maxTop

  maskObj.style.left = tmpx + 'px';
  maskObj.style.top = tmpy + 'px';

  // 4-4 计算大图能够移动的最大位置
  let bigImgMaxLeft = bigImg.offsetWidth - bigObj.offsetWidth;
  let bigImgMaxTop = bigImg.offsetHeight - bigObj.offsetHeight;

  // 小黄块的实时位置/小黄块移动的最大位置 == ===  大图实时位置/大图能够移动的最大位置
  let tmpBigTop = tmpy / maxTop * bigImgMaxTop;
  let tmpBigLeft = tmpx / maxLeft * bigImgMaxLeft;

  // 4-5 将计算的大图实时位置进行设置
  bigImg.style.left = -tmpBigLeft + 'px';
  bigImg.style.top = -tmpBigTop + 'px';
}
