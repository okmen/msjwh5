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
