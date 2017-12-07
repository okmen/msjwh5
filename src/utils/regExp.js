/**
 * Created by Administrator on 2017/7/5.
 */
/* eslint-disable */
import Vue from 'vue'
const verification = {
  // 检测手机号码
  isPhone (str) {
    var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[678])[0-9]{8}$/
    if (!reg.test(str)) {
      window.VM.$toast({
        message: '手机号码格式不正确',
        position: 'middle',
        duration: 3000
      })
    }
    return !reg.test(str)
  },
  //检测全部为中文汉字
  isChinese (str) {
    var reg = /^[\u4E00-\u9FA5]+$/
    if (reg.test(str)) {
      return true
    } else {
      return false
    }
  },
  // 特殊字符判断
  specialCharacters: (str) => {
    var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
    if (reg.test(str)) {
      window.VM.$toast({
        message: '姓名不能含有特殊字符',
        position: 'middle',
        duration: 3000
      })
    }
    return reg.test(str)
  },
  // 检测照片回执码
  isPhotoNum (str) {
    var reg = /^[a-zA-Z0-9]{10,25}$/
    if (reg.test(str)) {
      window.VM.$toast({
        message: '请输入正确的照片回执码',
        position: 'middle',
        duration: 3000
      })
    }
    return reg.test(str)
  },
  plateVerification (str) {
   if (!/(^(粤B|苏A|苏B|鲁A|沪[a-zA-z]{1})[A-Za-z0-9]{5,6}$|^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{6}$|^粤Z[A-Za-z0-9\u4e00-\u9fa5]{4,5}(港|澳)$)/.test(str)) {
     window.VM.$toast({
       message: '请输入正确的车牌号码',
       position: 'middle',
       duration: 3000
     })
     return true
    } else {
     return false
   }
  }
}

Vue.prototype.$verification = verification
