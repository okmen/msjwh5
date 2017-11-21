<template>
    <div class="replace-credentials">
      <div class="form-template-item">
        <span class="form-template-item-left">业务类型</span>
        <div class="form-template-item-type">{{currentBusinessType}}</div>
      </div>
      <div class="exchange-license-line"></div>
      <router-view></router-view>
      <div v-wechat-title="$route.meta.title"></div>
      <page-bottom v-if="isWeChat"></page-bottom>
    </div>
</template>
<style lang="less" scoped>
  .form-template-item-type{
    border: 2px solid #e5e5e5;
    border-radius: 8px;
    outline: none;
    height: 70px;
    font-size: 30px;
    padding-left:15px;
    line-height:70px;
    width: 66%;
  }
  .replace-credentials>div{
    margin: 0 40px 30px;
  }
  .replace-credentials{
    height: auto;
    background: white;
    position: relative;
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .replace-credentials .exchange-license-line{
    height: 10px;
    background: #eeeeee;
    margin-left: 0;
    margin-right: 0;
  }
</style>
<script>
  import { MessageBox } from 'mint-ui'
  export default {
    computed: {
      isWeChat: function () {
        console.log(this.$route)
        return /_WeChat/g.test(this.$route.path)
      }
    },
    data () {
      return {
        defaultVal: '',
        businessType: {
          'repairDrivingLicense': '补领行驶证',
          'exchangeDrivingLicense': '换领行驶证',
          'replaceQualifiedMark': '补换检验合格标志',
          'replaceLicencePlate': '补换机动车号牌'
        },
        currentBusinessType: ''
      }
    },
    created () {
      this.currentBusinessType = this.businessType[this.$route.name]
      if (!window.localStorage.getItem('myNumberPlate')) {
        MessageBox('温馨提示', '暂无车辆,你可以通过深圳交警微信号的“个人中心”绑定车辆')
      }
    },
    watch: {
      '$route' (val) {
        this.currentBusinessType = this.businessType[val.name]
      }
    },
    components: {
      divSelect: require('./components/divSelect.vue'),
      'pageBottom': require('../../../../../components/pageBottom.vue')
    }
  }
</script>
