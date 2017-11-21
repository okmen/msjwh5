var Toasts = {}
Toasts.install = (Vue, options) => {
  let opt = { // 默认配置
    defaultType: 'bottom',
    duration: '25000'
  }

  for (let property in options) {
    opt[property] = options[property] // 使用options的配置
  }

  Vue.prototype.$toast = (tips, type) => {
    if (type) { // 如果有type,位置则设为该type
      opt.defaultType = type
    }

    if (document.getElementsByClassName('vue-toast').length) {
      // 如果toast还在，则不再执行
      return false
    }

    let ToastTpl = Vue.extend({ // 1、创建构造器，定义好提示信息的模板
      template: `<div class="vue-toast toast-${type}">${tips}</div>`
    })

    let tpl = new ToastTpl().$mount().$el // 2、创建实例，挂载到文档以后的地方

    document.body.appendChild(tpl)  // 3、把创建的实例添加到body中

    setTimeout(function () {  // 4、延迟2.5S后移除该提示
      document.body.removeChild(tpl)
    }, opt.duration)
  }

  ['bottom', 'center', 'top'].forEach(type => {
    Vue.prototype.$toast[type] = tips => {
      return Vue.prototype.$toast(tips, type)
    }
  })
}
module.exports = Toasts
