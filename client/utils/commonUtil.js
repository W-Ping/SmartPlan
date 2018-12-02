/**
 * 置顶数组元素位置
 */
const toArrayTop = (array, index) => {
  if (array && array.length > 0) {
    var item = null;
    for (var i = 0; i < array.length; i++) {
      if (i === index) {
        item = array[i];
        array.splice(i, 1);
        break;
      }
    }
    if (item != null) {
      array.unshift(item);
    }
  }
  return array;
}
const preTouchMoveBox = (array)=>{
  array.forEach(function (v, i) {
    if (v.isTouchMove) //只操作为true的
      v.isTouchMove = false;
  })
  return array;
} 

/**
 * 滑动模块
 * @param {array} 数据列表
 * @param {number}  滑动索引
 * @param {number}} startX 起点坐标
 * @param {number} startY 起点坐标
 * @param {number} touchMoveX 终点坐标
 * @param {number} touchMoveY 终点坐标
 */
const touchMoveBox = (array, index, startX, startY, touchMoveX, touchMoveY) => {
  var angleVal= angle({
    X: startX,
    Y: startY
  }, {
    X: touchMoveX,
    Y: touchMoveY
  });
  array.forEach(function(v, i) {
    v.isTouchMove = false
    //滑动超过30度角 return
    if (Math.abs(angleVal) > 30) return;
    if (i == index) {
      if (touchMoveX > startX) { //右滑
        v.isTouchMove = false
      } else { //左滑
        v.isTouchMove = true
      }
    }
  })
  console.log(array);
  console.log("touchMoveX:" + touchMoveX + "--touchMoveY:" + touchMoveY);
  console.log("startX:" + startX + "--startY:" +startY);
  return array;
}
/**
 * 计算滑动角度
 * @param {Object} start 起点坐标
 * @param {Object} end 终点坐标
 */
const angle = (start, end) => {
  var _X = end.X - start.X,
    _Y = end.Y - start.Y
  //返回角度 /Math.atan()返回数字的反正切值
  return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
}
module.exports = {
  toArrayTop, preTouchMoveBox,touchMoveBox
}