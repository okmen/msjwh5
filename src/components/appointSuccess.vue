<template>
  <div id="appointSuccess">
    <section class="appoint-img">
      <dl>
        <dd></dd>
        <dt>申办成功</dt>
      </dl>
    </section>
    <section class="appoint-box">
      <h3>预约成功</h3>
      <p>
        您的信息已提交成功，您可以凭身份证信息在个人中心查询审核。
      </p>
      <p class="appoint-margin" v-if="showAppoin.appoinType">业务类型：<span>{{showAppoin.appoinType}}</span></p>
      <p v-if="showAppoin.appoinNum">流水号码：<span class="running-number">{{showAppoin.appoinNum}}</span></p>
    </section>
    <!-- <div class="btn-appoint-backword" @click="btnBackword">返回</div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'showAppoin'
    ])
  },
  methods: {
    btnBackword: function () {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="less">
#appointSuccess{
  position: absolute;
  height:100%;
  width:100%;
  background:#FFF url('../assets/images/appointBack.png') bottom no-repeat;
  background-size:100% 32%;
  .appoint-img{
    width:100%;
    height:250px;
    dl{
      margin:0 auto;
      padding-top:74px;
      width:178px;
      height:100%;
      dd{
        width:100%;
        height:178px;
        background:url('../assets/images/appointSuccess.png') no-repeat;
        background-size:100%;
      }
      dt{
        line-height:72px;
        text-align:center;
      }
    }
  }
  .appoint-box{
    margin:100px auto 0;
    padding:0 20px;
    width:550px;
    height:400px;
    border:1px solid #969696;
    border-radius:8px;
    h3{
      margin-bottom:30px;
      width:100%;
      height:70px;
      border-bottom:1px solid #969696;
      text-align:center;
      line-height:70px;
      font-size:30px;
      font-weight:normal;
    }
    p{
      font-size:24px;
      line-height:40px;
      .running-number{
        color:#FF0000;
      }
    }
    .appoint-margin{
      margin-top:34px;
    }
  }
  .btn-appoint-backword{
    margin:20px auto 0;
    width:550px;
    height:82px;
    background:#2696dd;
    color:#FFF;
    font-size:30px;
    line-height:80px;
    text-align:center;
    border-radius:8px;
  }
}
</style>