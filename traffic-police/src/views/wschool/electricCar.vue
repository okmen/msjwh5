<template>
  <div class="navv">
    <ul class="nav-outer">
      <li class="nav-outer-center">
        <router-link :to="isLogin ? '/userAgreement/ddcNotice' : '/login'">
          <p>电动车学习</p>
        </router-link>
      </li>
      <li class="nav-outer-center">
        <!-- <a href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc2b699cf2f919b58&redirect_uri=http://gzh.stc.gov.cn/szjjpro/index.php/electricVehicle/businessType&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect">
          <p>电动车扫码</p>
        </a> -->
         <router-link :to="isLogin? '/electrocarFile/scancode': '/login'">
          <p>电动车扫码</p>
        </router-link>
      </li>
    </ul>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
export default {
  name: 'electricCar',
  data () {
    return {
      isLogin: false
    }
  },
  mounted () {
    this.isLogin = window.localStorage.getItem('isLogin')
  }
}
</script>
<style lang="less">
.nav-outer {
  width: 100%;
}

.nav-outer-center {
  width: 100%;
  line-height: 90px;
  font-size: 26px;
  border-bottom: 1px solid #dbdbdb;
  background: url('../../images/space.png') no-repeat;
  background-position: 96% center;
}

.nav-outer-center p {
  margin-left: 46px;
}
</style>
