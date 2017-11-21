<template>
  <div class="credit">
    <ul class="handyService-list">
      <li class="handyService-item" v-for="item in list">
        <router-link :to="isLogin ? item.path : '/login'">
          <p>{{item.name}}</p>
        </router-link>
      </li>
    </ul>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<style lang="less" scoped>
  .credit{
    .handyService-list{
      .handyService-item{
        width: 100%;
        line-height: 90px;
        font-size: 26px;
        border-bottom: 1px solid #dbdbdb;
        background: url('../../images/space.png') no-repeat;
        background-position: 96% center;
        background-size: 12px 21px;
        &:hover{
          background-color: #7ab8df;
        };
        a{
          display: block;
          p{
            margin-left: 46px;
          }
        }
      }
    }
  }
</style>
<script>
  export default {
    data () {
      return {
        list: [
          {name: '驾驶人安全事故信用表', path: 'userAgreement/aqsgxyb'},
          {name: '无车证明', path: 'userAgreement/wczm'},
          {name: '驾驶人信息单', path: 'userAgreement/jsrxxd'},
          {name: '机动车信息单', path: 'userAgreement/jdcxxd'},
          {name: '电子回单', path: 'digByCar'}
        ],
        isLogin: ''
      }
    },
    mounted () {
      this.isLogin = window.localStorage.getItem('isLogin')
    }
  }
</script>
