//获取节点 
let ulLisObj = document.querySelectorAll('.main_left ul li');
let olLisObj = document.querySelectorAll('.main_left ol li');
let prev = document.querySelector('.focus_left');
let next = document.querySelector('.focus_right')
console.log(prev, next);
// 要进去,隐藏的图片索引
let lastIndex = 0;
//要显示,给出来的图片索引 
let index = 0;
// 2 给ol 下所有li绑定点击事件
olLisObj.forEach((li, key) => {
  // console.log(li);
  li.onclick = function () {
    // 2-1 设置要隐藏和显示的索引
    lastIndex = index;
    index = key;
    change();
  }
});
// 实现右边按钮
next.onclick = function () {
  lastIndex = index;
  index++;
  // 判断索引是否超过最大值
  if (index > ulLisObj.length - 1) {
    index = 0;
  }
  change();
}

// 实现左边按钮,上一张
prev.onclick = function () {
  lastIndex = index;
  index--;
  // 判断超过最小索引,则直接赋值最大索引
  if (index < 0) {
    index = ulLisObj.length - 1;
  }
  change();
}
// 自动播放的实现
let times = '';
function autoPlay() {
  times = setInterval(function () {
    // 直接就是下一张
    next.onclick();
  }, 2000)
}
autoPlay();

// 鼠标移入则清除定时器
next.parentNode.onmouseover = function () {
  clearInterval(times)
}
// 鼠标移入则继续开始
next.parentNode.onmouseout = function () {
  autoPlay();
}
// 操作显示对应的图片和按钮
function change() {
  // 设置上一张图片隐藏
  ulLisObj[lastIndex].className = '';
  olLisObj[lastIndex].className = '';

  // 设置当前操作的图片显示
  ulLisObj[index].className = 'focus_bottom';
  olLisObj[index].className = 'focus_bottom';
}