<template>
<div class="updatePwd-outer pad-side-50">
  <ul class="updatePwd-list">
    <li class="updatePwd-item">
      <div class="updatePwd-name">旧密码</div>
      <div class="updatePwd-text">
        <input class="text-input" type="password" placeholder="请输入旧密码" v-model:value="oldPwd">
      </div>
    </li>
    <li class="updatePwd-item">
      <div class="updatePwd-name">新密码</div>
      <div class="updatePwd-text">
        <input class="text-input" type="password" placeholder="请输入新密码" v-model:value="newPwd">
      </div>
    </li>
    <li class="updatePwd-item">
      <div class="updatePwd-name">确认密码</div>
      <div class="updatePwd-text">
        <input class="text-input" type="password" placeholder="请输入确认密码" v-model:value="comfirmPwd">
      </div>
    </li>
  </ul>
  <button class="btn btn-blue"  type="button" name="button" @click.stop="submit()">修改密码</button>
</div>
</template>

<script>
import { updatePwd } from '../../../config/baseUrl'
import { resultPost } from '../../../service/getData'
import { Toast, Indicator } from 'mint-ui'
export default{
  name: 'updatePwd',
  data () {
    return {
      oldPwd: '',
      newPwd: '',
      comfirmPwd: '',
      identityCard: ''
    }
  },
  methods: {
    submit: function () {
      let reqData = {
        oldPwd: this.oldPwd,
        newPwd: this.newPwd,
        identityCard: this.identityCard
      }
      for (let key in reqData) {
        if (!reqData[key]) {
          Toast({
            message: '信息填写不完整',
            position: 'bottom',
            className: 'white'
          })
          return false
        }
      }
      if (this.newPwd !== this.comfirmPwd) {
        Toast({
          message: '新密码不一致',
          position: 'bottom',
          className: 'white'
        })
      } else if (this.oldPwd === this.newPwd) {
        Toast({
          message: '新密码不能与旧密码一致',
          position: 'bottom',
          className: 'white'
        })
      } else if (this.newPwd === this.comfirmPwd) {
        Indicator.open('正在提交...')
        resultPost(updatePwd, reqData).then(json => {
          Indicator.close()
          console.log(json)
          if (json.code === '0000') {
            Toast({
              message: '修改成功',
              position: 'bottom',
              className: 'white'
            })
            window.localStorage.removeItem('behindTheFrame4Digits')
            window.localStorage.removeItem('cars')
            window.localStorage.removeItem('identityCard')
            window.localStorage.removeItem('isLogin')
            window.localStorage.removeItem('mobilePhone')
            window.localStorage.removeItem('myNumberPlate')
            window.localStorage.removeItem('plateType')
            window.localStorage.removeItem('userName')
            window.location.hash = '/login'
            console.log('提交数据并返回我的资料页面')
          } else {
            Toast({
              message: json.msg,
              position: 'bottom',
              duration: 2000
            })
          }
        })
      }
    },
    closeTips: function () {
      this.tipsShow = false
      this.msg = ''
    }
  },
  created () {
    this.identityCard = window.localStorage.getItem('identityCard')
  },
  beforeDestory () {
    Indicator.close()
  }
}
</script>

<style lang="less">
.updatePwd-outer{
  background: #fff;
  font-size: 28px;
  color: #000;
  .updatePwd-list{
    overflow: hidden;
    .updatePwd-item{
      margin-top: 34px;
      padding-left: 130px;
      line-height: 56px;
      position: relative;
      .updatePwd-name{
        position: absolute;
        left: 0;
      }
    }
  }
}
.white{
  span{
    color: #fff;
  }
}
</style>