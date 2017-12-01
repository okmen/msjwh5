import Vue from 'vue'

Vue.prototype.$plateerification = function (plate) {
  if (plate.length === 1) {
    return '请输入车牌号码'
  } else if (!/(^(粤B|苏A|苏B|鲁A|沪[a-zA-z]{1})[A-Za-z0-9]{5,6}$|^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{6}$|^粤Z[A-Za-z0-9\u4e00-\u9fa5]{4,5}(港|澳)$)/.test(plate)) {
    return '请输入正确的车牌号码'
  }
}
