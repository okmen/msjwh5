/**
 * Created by Administrator on 2017/7/5.
 */
/* eslint-disable */
// 检测手机号码
const isPhone = function (str) {
  var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[678])[0-9]{8}$/
  if (reg.test(str)) {
    return true;
  } else {
    return false;
  }
}

//检测全部为中文汉字
const isChinese = function (str) {
  var reg = /^[\u4E00-\u9FA5]+$/
  if (reg.test(str)) {
    return true
  } else {
    return false
  }
}
// 特殊字符判断
const specialCharacters = function (str) {
  var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
  return reg.test(str)
}

// 车牌号码正则判断
const plateNumberDetection = function (str) {
  var reg = /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/
  return reg.test(str)
}

// 检测照片回执码
const isPhotoNum = function (str) {
  var reg = /^[a-zA-Z0-9]{10,25}$/
  if (reg.test(str)) {
    return true;
  } else {
    return false;
  }
}

export {isPhone, isChinese, specialCharacters, plateNumberDetection, isPhotoNum}
