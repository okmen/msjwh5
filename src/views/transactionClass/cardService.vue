<template>
  <!-- 办理类-驾驶证业务导航页 -->
  <div class="cardService-outer">
    <div class="query-link">
      <router-link :to="{ path: '/userAgreement/jszbzhz', query: { source: this.source, idcard: this.idcard, openid: this.openid }}">驾驶证补换证</router-link>
    </div>
    <div class="query-link">
      <router-link :to="{ path: '/userAgreement/jszns', query: { source: this.source, idcard: this.idcard, openid: this.openid }}">驾驶证年审</router-link>
    </div>
    <div class="query-link">
      <router-link :to="{ path: '/applyClass/02', query: { source: this.source, idcard: this.idcard, openid: this.openid }}">申请机动车临牌</router-link>
    </div>
    <div class="query-link">
      <router-link :to="{ path: '/userAgreement/szjj_hander_rmvp', query: { source: this.source, idcard: this.idcard, openid: this.openid }}">补换机动车号牌</router-link>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'cardService',
    data () {
      return {
        source: '',
        idcard: '',
        openId: ''
      }
    },
    computed: {
      user () {
        return Object.assign({}, this.$store.state.core)
      }
    },
    created () {
      let val = this.$store.state.core
      this.source = val.source
      this.idcard = val.idCard
      this.openid = val.openId
    },
    methods: {
    }
  }
</script>
<style lang="less" scopsd>
  .cardService-outer {
    position: relative;
    background-color: white;
    font-size: 26px;
    color: #000;
    .query-link {
      border-bottom: 1px solid #dbdbdb;
      line-height: 88px;
      a {
        display: block;
        padding-left: 50px;
      }
      p {
        padding: 0 50px;
        position: relative;
        i {
          width: 26px;
          height: 26px;
          display: inline-block;
          position: absolute;
          right: 40px;
          background-size: cover;
          top: 28px;
          &.arrow-open {
            background-image: url("../../assets/images/arrow-open.png");
          }
          &.arrow-close {
            background-image: url("../../assets/images/arrow-close.png");
          }
        }
      }
      .li-box {
        padding: 0 20px;
        background-color: #e9e9e9;
        display: none;
        a {
          display: block;
          text-align: center;
          text-indent: -50px;
          border-bottom: 1px solid #b5b4b4;
          background-color: #e9e9e9;
          &:last-child {
            border: none;
          }
        }
      }
      &.show {
        p {
          color: #fff;
          background-color: #7ab8df;
        }
        .li-box {
          display: block;
        }
      }
    }
  }

</style>
