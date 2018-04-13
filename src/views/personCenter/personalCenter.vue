<template>
  <div class="personalCenter">
    <div class="userInfo-banner">
      <div class="userInfo-avatar">
        <!-- <img :src="avatar"> -->
      </div>
      <p class="userInfo-name">{{val.userName}}</p>
      <div class="userInfo-mobile">
        <i class="mobile"></i>
        {{val.mobilePhone}}
      </div>
    </div>
    <mt-cell v-for="(item, index) in personalData" :title="item.title" :to="{ path: item.link, query: queryURL }" key="index" is-link></mt-cell>
    <g-button text="退出登录" @click.native="handleLogout"></g-button>
  </div>
</template>

<script>
import { Cell } from 'mint-ui'
import { GButton } from 'form'
import { token, msjwURL } from '@/config/msjw.config'
export default {
  name: 'personalCenter',
  data () {
    return {
      val: '',
      avatar: '',
      token: token,
      openid: window.localStorage.getItem('openid'),
      personalData: [
        {
          title: '微课堂学习',
          link: '/smallClass'
        },
        {
          title: '便民服务',
          link: '/handyService'
        },
        {
          title: '电动车管理',
          link: '/electricCar'
        },
        {
          title: '补全或修改资料',
          link: '/updateUser'
        },
        {
          title: '绑定车辆',
          link: '/myCar'
        },
        {
          title: '信息单据证明',
          link: '/credit'
        },
        {
          title: '违法处理业务',
          link: '/newqueryLawless'
        }
      ]
    }
  },
  computed: {
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  components: {
    Cell, GButton
  },
  methods: {
    // 退出登录
    handleLogout () {
      this.$MessageBox.confirm('确定退出登录吗?').then(action => {
        let nAxios = this.$axios.create({
          headers: {
            'Content-Type': 'application/json'
          }
        })
        nAxios.post(`${msjwURL}/govnetUserAuthProvider/services/userCenter/logout`, {
          openid: this.openid,
          token: this.token
        }).then(data => {
          if (data.data.code === '200') {
            window.sessionStorage.clear()
            window.localStorage.clear()
            // window.location.reload()
            window.history.go(0)
          }
        })
      }).catch(() => {})
    }
  },
  mounted () {
    this.val = this.$store.state.user
  }
}
</script>

<style lang="less" scoped>
  .personalCenter {
    .userInfo-banner{
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 360px;
      background: url("../../assets/images/user-banner.png") no-repeat;
      background-size: cover;
      font-size: 30px;
      overflow: hidden;
      .userInfo-avatar{
        width: 140px;
        height: 140px;
        margin-top: 36px;
        /*border-radius: 50%;*/
        /*background: #fff;*/
        background: url('../../assets/images/logo.png');
        background-size: cover;
        overflow: hidden;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          vertical-align: top;
        }
      }
      .userInfo-name{
        margin-top: 10px;
        color: #fff;
      }
      .userInfo-mobile{
        margin-top: 30px;
        color: #fff;
        i{
          display: inline-block;
          width: 20px;
          height: 36px;
          vertical-align: -3px;
          margin-right: 12px;
          background-image: url('../../assets/images/userInfo-mobile.png');
          background-size: cover;
        }
      }
    }
    .mint-cell {
      border-bottom: 1px solid #ddd;
    }
  }
</style>
