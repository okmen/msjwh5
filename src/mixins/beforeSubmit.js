/* 混和方法 只能判断是不是为空
*  obj 为对象
*  属性：要判断的参数，且必须在data 里面
*  属性值：提示语
*
* */
var beforeSubmit = {
  methods: {
    $_myMinxin_beforeSubmit (obj) {
      for (let key in obj) {
        if (!this.$data[key].trim()) {
          this.$toast({
            message: obj[key],
            position: 'middle',
            duration: 3000
          })
          return true
        }
      }
      return false
    }
  }
}
export default beforeSubmit
