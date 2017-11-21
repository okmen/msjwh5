<template>
  <div class="queryLawless-outer">
    <div class="query-link">
      <router-link :to="nologin ? 'newqueryByCar?type=nologin' : 'newqueryByCar'">交通违法查询</router-link>
    </div>
    <div  class="query-link">
      <router-link to="newPayLawless">交通违法缴款</router-link>
    </div>
    <div class="query-link" v-bind:class="{ 'show' : isShow}">
      <p @click.stop="clickShow()">交通违法在线处理</p>
      <div class="li-box">
        <router-link :to="isLogin ? 'confirmLawless' : 'login'">交通违法在线确认</router-link>
        <router-link :to="isLogin || nologin ? 'newEarly' : 'login'">交通违法预约处理</router-link>
        <router-link :to="isLogin ? 'appealEntry' : 'login'">交通违法申诉</router-link>
      </div>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
//  import { resultPost } from '../../service/getData'
//  import { LawlessBusiness } from '../../config/baseUrl'
export default {
  name: 'queryLawless',
  data () {
    return {
      isShow: false,
      businesses: [],
      isLogin: window.localStorage.getItem('isLogin'),
      nologin: false
    }
  },
  created () {
    this.nologin = this.$route.query.type === 'nologin'
  },
  methods: {
    clickShow: function () {
      this.isShow = !this.isShow
    }
  }
}
</script>
<style lang="less" scoped>
.queryLawless-outer {
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
    }
    .li-box {
      padding-left: 50px;
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
