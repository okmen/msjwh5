<template>
<div class="userInfo-outer">
  <div class="userInfo-banner">
    <div class="userInfo-avatar"><img :src="avatar"></div>
    <p class="userInfo-name">{{userName}}</p>
    <div class="userInfo-mobile">
      <i class="mobile"></i>
      {{mobile}}
    </div>
  </div>
  <ul class="userInfo-list">
    <li class="userInfo-item">
      <router-link class="link" to="/updateMobile">
        <div class="userInfo-item-name">修改手机号</div>
        <div class="userInfo-item-arrow">
          <p>{{mobile}}</p>
        </div>
      </router-link>
    </li>
    <li class="userInfo-item">
      <router-link class="link" to="/updatePwd">
        <div class="userInfo-item-name">账号安全</div>
        <div class="userInfo-item-arrow">
          <p>修改密码</p>
        </div>
      </router-link>
    </li>
    <li class="userInfo-item">
      <router-link class="link" to="/updateUser">
        <div class="userInfo-item-name">补全或修改资料</div>
        <div class="userInfo-item-arrow">
        </div>
      </router-link>
    </li>
  </ul>
  <div class="userInfo-btn pad-side-50">
    <button class="btn btn-red" type="button" name="button" @click.stop="deleteVehicle()">取消微信綁定</button>
    <div class="tips">
      <p>取消关联后，将不可及时获取到您车辆的交通违法提醒、驾驶证到期换证提醒等信息。</p>
    </div>
  </div>
</div>
</template>

<script>
import { deleteVehicle } from '../../../config/baseUrl'
import { resultPost } from '../../../service/getData'
import { MessageBox, Indicator } from 'mint-ui'

export default{
  name: 'userInfo',
  data () {
    return {
      avatar: '',
      userName: '',
      mobile: ''
    }
  },
  methods: {
    deleteVehicle: function () {
      MessageBox({
        title: '',
        message: '是否确定取消绑定？',
        showCancelButton: true,
        confirmButtonText: '是的'
      }).then(action => {
        action === 'confirm' && this.submit()
      })
    },
    submit: function () {
      let reqData = {
        identityCard: this.identityCard,
        openId: this.openId,
        unionId: this.unionId
      }
      console.log(reqData)
      Indicator.open('正在提交...')
      resultPost(deleteVehicle, reqData).then(json => {
        Indicator.close()
        window.localStorage.clear()
        if (json.code === '0000') {
          console.log(json)
          console.log('退出登录状态，返回首页')
          // 退出登录
          this.$root.$router.isWeChat ? this.$router.push(`/personalCenter?from=wechat&businessType=${this.$root.$router.businessType}`) : this.$router.push('/', () => {
            window.location.reload()
          })
        } else {
          MessageBox({
            title: '',
            message: json.msg
          })
        }
      })
    }
  },
  created () {
    this.identityCard = window.localStorage.getItem('identityCard') // 身份证
    this.openId = window.localStorage.getItem('openId') // 微信openId
    this.userName = window.localStorage.getItem('userName') // 用户名
    this.mobile = window.localStorage.getItem('mobilePhone') // 用户手机号码
    this.avatar = window.localStorage.getItem('headImgUrl') // 用户头像
    this.unionId = window.localStorage.getItem('unionId') // 支付宝unionId
  },
  beforeDestory () {
    Indicator.close()
  }
}
</script>

<style lang="less">
.userInfo-outer{
  background: #fff;
  .userInfo-banner{
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
    height: 360px;
    background: url("../../../images/user-banner.png") no-repeat;
    background-size: cover;
    font-size: 30px;
    overflow: hidden;
    .userInfo-avatar{
      width: 140px;
      height: 140px;
      margin-top: 36px;
      border-radius: 50%;
      background: #fff;
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
        background-image: url('../../../images/userInfo-mobile.png');
        background-size: cover;
      }
    }
  }
  .userInfo-list{
    .userInfo-item{
      width: 100%;
      line-height: 94px;
      border-bottom: 1px solid #dadada;
      .link{
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        padding: 0 20px 0 26px;
        box-sizing: border-box;
        font-size: 28px;
        .userInfo-item-arrow{
          padding-right: 30px;
          background: url('../../../images/userInfo-arrow.png') right no-repeat;
          background-size: 12px 22px;
          p{
            color: #999;
          }
        }
      }
    }
  }
  .userInfo-btn{
    .btn-red{
      background-color: #f76260;
    }
    .tips{
      margin-top: 20px;
      padding-left: 38px;
      background: url('../../../images/userInfo-warn.png') 0 0 no-repeat;
      background-size: 24px;
      p{
        font-size: 22px;
        line-height: 26px;
        color: #999;
      }
    }
  }
}

</style>
