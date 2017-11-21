<template>
  <div class="handyService-outer">
    <ul class="handyService-list">
      <li class="handyService-item">
        <router-link :to="isLogin ? '/moveCar' : '/login'">
          <p>一键挪车</p>
        </router-link>
      </li>
      <li class="handyService-item">
       <router-link :to="isLogin ? '/bindCar' : '/login'">
          <p>一键救援</p>
        </router-link>
      </li>
    </ul>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
export default {
  name: 'handyService',
  data () {
    return {
      openId: '',
      isLogin: false
    }
  },
  mounted () {
    this.openId = window.localStorage.getItem('openId')
    this.isLogin = window.localStorage.getItem('isLogin')
  }
}
</script>
<style lang='less'>
  .handyService-outer{
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
