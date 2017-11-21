<template>
<div id="authorityIssue">
  <div class="main_bg">
    <img src="./../../images/bg_26bb276e.png" class="bg">
      <router-link to="/userAgreement/xjyhrz">
        <div class="business1">
          <img src="./../../images/xj_3819a097.png"><br>星级用户
        </div>
      </router-link>
      <router-link :to="isLogin ? '/queryLawlessPage' : '/login'">
        <div class="business2">
          <img src="./../../images/wfcx_ccaaf395.png"><br>违法查询
        </div>
      </router-link>
      <router-link :to="isLogin ? '/early' : '/login'">
        <div class="business3 appointmentForIllg">
          <img src="./../../images/wfyy_77227689.png"><br>违法预约
        </div>
      </router-link>
      <a :href="'http://gzh.stc.gov.cn/szjjpro/cheguan/xwsq/'+openId">
        <div class="business4 xwsq">
          <img src="./../../images/txz_70246e3c.png"><br>通行证办理
        </div>
      </a>
      <router-link :to="isLogin ? '/payLawless' : '/login'">
        <div class="business5 paymentSearch">
          <img src="./../../images/jf_873fffad.png"><br>违法缴费
        </div>
      </router-link>
      <router-link :to="isLogin ? '/moveCar' : '/login'">
        <div class="business6">
          <a href="tel:0755-83333333">
            <img src="./../../images/nc_f2fcee0e.png"><br>一键挪车
          </a>
        </div>
      </router-link>
      <router-link :to="isLogin ? '/userAgreement/xfNotice' : '/login'">
        <div class="business7 eliminationStudy">
          <img src="./../../images/mf_12d603d5.png"><br>消分学习
        </div>
      </router-link>
      <a :href="'http://gzh.stc.gov.cn/szjjpro/Business/HomePage/feePayment/'+openId">
        <div class="business8 cggfjn">
          <img src="./../../images/jn_273b136c.png"><br>规费缴纳
        </div>
      </a>
  </div>
  <div v-wechat-title="$route.meta.title"></div>
</div>
</template>
<script>
export default {
  name: 'authorityIssue',
  data () {
    return {
      userName: '',
      userIdentityCard: '',
      userNumberPlate: '',
      isLogin: false,
      openId: '',
      icpTara: '',
      mobilePhone: '',
      plateType: ''
    }
  },
  created () {
    this.openId = !window.localStorage.getItem('openId') ? '' : window.localStorage.getItem('openId')
    this.userName = !window.localStorage.getItem('userName') ? '' : window.localStorage.getItem('userName')
    this.userImg = !window.localStorage.getItem('headImgUrl') ? '' : window.localStorage.getItem('headImgUrl')
    this.mobilePhone = !window.localStorage.getItem('mobilePhone') ? '' : window.localStorage.getItem('mobilePhone')
    this.userIdentityCard = !window.localStorage.getItem('identityCard') ? '' : window.localStorage.getItem('identityCard')
    if (window.localStorage.getItem('myNumberPlate') !== 'undefined') {
      this.userNumberPlate = !window.localStorage.getItem('myNumberPlate') ? '' : window.localStorage.getItem('myNumberPlate')
    }
    if (window.localStorage.getItem('plateType') !== 'undefined') {
      this.plateType = !window.localStorage.getItem('plateType') ? '' : window.localStorage.getItem('plateType')
    }
    this.isLogin = window.localStorage.getItem('isLogin')
    this.icpTara = `https://icp-tara.pingan.com.cn:10443/icp-tara/do/page/changePage?cername=${this.userName}&certno=${this.userIdentityCard}&carMark=${this.userNumberPlate}&openid=${this.openId}&mobile=${this.mobilePhone}&userType=1&carType=${this.plateType}`
  }
}
</script>
<style lang="less" >
#authorityIssue {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000;
  height: 100%;
}
.main_bg {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0
}

.main_bg img.bg {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 0;
  top: 0;
  left: 0
}

.main_bg div {
  width: 19%;
  position: absolute;
  font-size: 12px;
  text-align: center
}

.main_bg div img {
  width: 90%
}

.business1 {
  top: 27.5%;
  left: 50%
}

.business2 {
  top: 44%;
  left: 25%
}

.business3 {
  top: 44%;
  left: 50%
}

.business4 {
  top: 44%;
  left: 74%
}

.business5 {
  top: 63.5%;
  left: 9%
}

.business6 {
  top: 63.5%;
  left: 50%;
  background: #fcf8db
}

.business7 {
  top: 63.5%;
  left: 74%
}

.business8 {
  top: 80%;
  left: 25%
}

#splashscreen {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #fff
}

#splashscreen img {
  min-height: 100%;
  min-width: 100%;
  height: 100%;
  width: 100%;
  position: absolute;
  top: -50%;
  bottom: -50%;
  left: -50%;
  right: -50%;
  margin: auto;
  z-index: 9999
}

a, a:active, a:hover, a:visited {
  color: #000;
  text-decoration: none
}
</style>
