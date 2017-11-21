<template>
<div class="updateUser-outer pad-side-50">
  <div class="updateUser-form">
    <ul class="updateUser-list">
      <li class="updateUser-item">
        <div class="updateUser-name">
          <span>姓名</span>
        </div>
        <div class="updateUser-text">
          <input class="text-input" type="text" placeholder="请输入您的姓名" v-model:value="tureName">
        </div>
      </li>
      <li class="updateUser-item">
        <div class="updateUser-name">
          <span>身份证号</span>
        </div>
        <div class="updateUser-text">
          <input class="text-input" type="text" placeholder="请输入您的身份证号" v-model:value="identityCard">
        </div>
      </li>
      <li class="updateUser-item">
        <div class="updateUser-name">
          <span>通讯地址</span>
        </div>
        <div class="updateUser-text">
          <input class="text-input" type="text" placeholder="请输入通讯地址" v-model:value="mailingAddress">
        </div>
      </li>
    </ul>
  </div>
  <div class="updateUser-upload">
    <p>请按提示上传以下证件照片</p>
    <div id="container" class="updateUser-upload-inner">
      <label id="idCardImgPositive" class="updateUser-upload-left updateUser-upload-box" for="idCardImgPositiveInput">
        <input type="file" id="idCardImgPositiveInput" accept="image/*">
        <img :src="idCardImgPositive" v-if="idCardImgPositive">
        <div class="box" v-else="idCardImgPositive">
          <em></em>
          <span>身份证(正面)</span>
        </div>
      </label>
      <label id="idCardImgNegative" class="updateUser-upload-center updateUser-upload-box" for="idCardImgNegativeInput">
        <input type="file" id="idCardImgNegativeInput" accept="image/*">
        <img :src="idCardImgNegative" v-if="idCardImgNegative">
        <div class="box" v-else="idCardImgNegative">
          <em></em>
          <span>身份证(反面)</span>
        </div>
      </label>
      <label id="idCardImgHandHeld" class="updateUser-upload-right updateUser-upload-box" for="idCardImgHandHeldInput">
        <input type="file" id="idCardImgHandHeldInput" accept="image/*">
        <img :src="idCardImgHandHeld" v-if="idCardImgHandHeld">
        <div class="box" v-else="idCardImgHandHeld">
          <em></em>
          <span>手持身份证</span>
        </div>
      </label>
    </div>
  </div>
  <button class="btn" type="button" name="button" @click.stop="submitClick()">提交</button>
</div>
</template>
<script>
import UploadFile from '../../../service/uploadFile'
import { updateUser } from '../../../config/baseUrl'
import { resultPost } from '../../../service/getData'
// import uploadImgFun from '../../../service/uploadImg'
import { Toast, Indicator } from 'mint-ui'

export default{
  name: 'updateUser',
  data () {
    return {
      tureName: '',
      identityCard: '',
      mailingAddress: '',
      idCardImgPositive: '',
      idCardImgNegative: '',
      idCardImgHandHeld: ''
    }
  },
  methods: {
    // getToken: function () {
    //   resultGet(uploadImg).then(res => {
    //     res.code === '0000' && this.uploadImgFn(res.upToken)
    //   })
    // },
    // uploadImgFn: function (uptoken) {
    //   var that = this
    //   uploadImgFun({
    //     selfId: 'idCardImgPositive',
    //     parentId: 'container',
    //     upToken: uptoken,
    //     fileUploaded: function (res) {
    //       that.idCardImgPositive = res.imgUrl
    //     },
    //     error: function (err) {
    //       console.log(err)
    //     }
    //   })
    //   uploadImgFun({
    //     selfId: 'idCardImgNegative',
    //     parentId: 'container',
    //     upToken: uptoken,
    //     fileUploaded: function (res) {
    //       that.idCardImgNegative = res.imgUrl
    //     },
    //     error: function (err) {
    //       console.log(err)
    //     }
    //   })
    //   uploadImgFun({
    //     selfId: 'idCardImgHandHeld',
    //     parentId: 'container',
    //     upToken: uptoken,
    //     fileUploaded: function (res) {
    //       that.idCardImgHandHeld = res.imgUrl
    //     },
    //     error: function (err) {
    //       console.log(err)
    //     }
    //   })
    // },
    init: function () {
      UploadFile.upload({
        id: 'idCardImgPositiveInput',
        callback: (res) => {
          this.idCardImgPositive = res.imgUrl
        }
      })
      UploadFile.upload({
        id: 'idCardImgNegativeInput',
        callback: (res) => {
          this.idCardImgNegative = res.imgUrl
        }
      })
      UploadFile.upload({
        id: 'idCardImgHandHeldInput',
        callback: (res) => {
          this.idCardImgHandHeld = res.imgUrl
        }
      })
    },
    submitClick: function () {
      let reqData = {
        tureName: this.tureName, // 姓名
        identityCard: this.identityCard, // 身份证号码
        mailingAddress: this.mailingAddress, // 通讯地址
        idCardImgPositive: this.idCardImgPositive.split(',')[1], // 身份证正面
        idCardImgNegative: this.idCardImgNegative.split(',')[1], // 身份证反面
        idCardImgHandHeld: this.idCardImgHandHeld.split(',')[1] // 手持身份证
      }
      for (let key in reqData) {
        if (!reqData[key]) {
          console.log(key)
          Toast({
            message: '信息填写不完整',
            position: 'bottom',
            className: 'white'
          })
          return false
        }
      }
      if (/[（*|）*]/g.test(this.identityCard)) {
        Toast({
          message: '请使用英文状态下的括号',
          position: 'bottom',
          className: 'white'
        })
        return false
      }
      Indicator.open('正在提交...')
      resultPost(updateUser, reqData).then(json => {
        Indicator.close()
        console.log(json)
        if (json.code === '0000') {
          Toast({
            message: '修改成功',
            position: 'bottom',
            className: 'white'
          })
          window.location.hash = '/userInfo'
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
  mounted () {
    // this.getToken()
    this.init()
  },
  beforeDestory () {
    Indicator.close()
  }
}
</script>
<style lang="less">
.updateUser-outer{
  font-size: 26px;
  color: #000;
  background: #fff;
  .updateUser-form{
    overflow: hidden;
    padding-bottom: 50px;
    .updateUser-item{
      margin-top: 34px;
      padding-left: 130px;
      position: relative;
      line-height: 56px;
      .updateUser-name{
        position: absolute;
        left: 0;
      }
    }
  }
  .updateUser-upload{
    p{
      font-size: 28px;
      margin-bottom: 34px;
    }
    .updateUser-upload-inner{
      display: flex;
      justify-content: space-between;
      .updateUser-upload-box {
        display: block;
        width: 190px;
        height: 190px;
        input[type=file]{
          display: none;
        }
        .box{
          width: 190px;
          height: 190px;
          background-color: #efeff4;
          border: 2px solid #dddde1;
          border-radius: 15px;
          color: #666;
          font-size: 22px;
          text-align: center;
          em {
            display: inline-block;
            width: 162px;
            height: 111px;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          span {
            display: block;
          }
        }
        img{
          width: 100%;
          height: 100%;
        }
      }
      .updateUser-upload-left {
        em {
          background-image: url('../../../images/ID-front.png');
          background-size: cover;
        }
      }
      .updateUser-upload-center {
        em {
          background-image: url('../../../images/ID-rear.png');
          background-size: cover;
        }
      }
      .updateUser-upload-right {
        em {
          background-image: url('../../../images/ID-hand.png');
          background-size: cover;
        }
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