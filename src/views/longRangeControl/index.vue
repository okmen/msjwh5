<template>
  <div class="longRangeControl">
    <p class="longRangeControl-p" v-if="show">正在载入轻微事故远程处理中心，请稍后。</p>
  </div>
</template>
<script>
  export default {
    name: 'serviceTab',
    data () {
      return {
        show: true,
        userNumberPlate: '',
        userName: '',
        userIdentityCard: '',
        openId: '',
        mobilePhone: '',
        plateType: ''
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        let val = this.$store.state.user
        this.userNumberPlate = val.myNumberPlate
        this.userName = val.userName
        this.userIdentityCard = val.identityCard
        this.openId = window.localStorage.getItem('openid')
        this.mobilePhone = val.mobilePhone
        this.plateType = val.plateType
        if (!this.userNumberPlate) {
          this.show = false
          this.$MessageBox({
            title: '温馨提示',
            message: '暂无车辆,请去星级用户中心绑定车辆。'
          }).then(action => {
            console.log(111)
            let source = this.$route.query.source
            this.$router.push({path: '/personalCenter', query: {source: source}})
          })
        } else {
          window.location.href = `https://icp-tara.pingan.com.cn:10443/icp-tara/do/page/changePage?cername=${this.userName}&certno=${this.userIdentityCard}&carMark=${this.userNumberPlate}&openid=${this.openId}&mobile=${this.mobilePhone}&userType=1&carType=${this.plateType}`
        }
      }
    }
  }
</script>
<style lang="less" scopsd>
.longRangeControl-p {
  margin-top: 20px;
  font-size: 36px;
  text-align: center;
}
</style>
