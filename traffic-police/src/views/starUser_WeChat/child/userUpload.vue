<template>
  <div class="star-upload-user starUser-upload">
      <p>请上传以下照片</p>
      <div class="starUser-upload-inner">
        <label class="starUser-upload-four starUser-upload-box" for="file4">
          <input id="file4" type="file" accept="image/*" >
          <img :src="userIdCardPositive">
        </label>
        <label class="starUser-upload-five starUser-upload-box" for="file5">
          <input id="file5" type="file" accept="image/*" >
          <img :src="userIdCardHandHeld">
        </label>
      </div>
      <div class="starUser-upload-inner">
        <label class="starUser-upload-left starUser-upload-box" for="file6">
          <input id="file6" type="file" accept="image/*" >
          <img :src="ownerIdCardPositive">
        </label>
        <label class="starUser-upload-right starUser-upload-box" for="file7">
          <input id="file7" type="file" accept="image/*" >
          <img :src="ownerIdCardHandHeld">
        </label>
      </div>
      <button class="btn" type="button" name="button" @click="btnSureStar">确认提交</button>
    </div>
</template>
<script>
import UploadFile from '../../../service/uploadFile'
export default {
  name: 'common',
  data () {
    return {
      userIdCardPositive: '',
      userIdCardHandHeld: '',
      ownerIdCardPositive: '',
      ownerIdCardHandHeld: ''
    }
  },
  mounted: function () {
    this.init()
  },
  methods: {
    init: function () {
      UploadFile.upload({
        id: 'file4',
        callback: (res) => {
          console.log(res)
          this.userIdCardPositive = res.imgUrl
        }
      })
      UploadFile.upload({
        id: 'file5',
        callback: (res) => {
          console.log(res)
          this.userIdCardHandHeld = res.imgUrl
        }
      })
      UploadFile.upload({
        id: 'file6',
        callback: (res) => {
          console.log(res)
          this.ownerIdCardPositive = res.imgUrl
        }
      })
      UploadFile.upload({
        id: 'file7',
        callback: (res) => {
          console.log(res)
          this.ownerIdCardHandHeld = res.imgUrl
        }
      })
    },
    btnSureStar: function () {
      this.$emit('btnSureStar')
    }
  }
}
</script>
<style lang="less" scoped>
.star-upload-user {
  margin-top:25px;
  background-color:#FFF;
  padding-bottom:50px;
  position: relative;
  .starUser-upload-inner {
    padding:0 80px;
    .starUser-upload-box {
      width: 190px;
      height: 190px;
      background-color: #efeff4;
      border: 2px solid #dddde1;
      border-radius: 15px;
      color: #666;
      font-size: 22px;
      text-align: center;
      img{
        width:100%;
        height:100%;
        border-radius: 15px;
      }
      input{
        position:absolute;
        width:100%;
        height:100%;
        visibility:hidden;
        top:0;
        left:0;
        z-index:998;
      }
    }
    .starUser-upload-left {
      background:#efeff4 url('../../../images/ownerIdImg1.png') center no-repeat;
      background-size: 90%;
      border:none;
    }
    .starUser-upload-center {
      background:#efeff4 url('../../../images/ownerIdImg2.png') center no-repeat;
      background-size: 90%;
      border:none;
    }
    .starUser-upload-right {
      background:#efeff4 url('../../../images/ownerIdImg3.png') center no-repeat;
      background-size: 90%;
      border:none;
    }
    .starUser-upload-four{
      background:#efeff4 url('../../../images/userIdImg3.png') center no-repeat;
      background-size: 90%;
      border:none;
      margin-bottom:20px;
    }
    .starUser-upload-five{
      background:#efeff4 url('../../../images/userIdImg2.png') center no-repeat;
      background-size: 90%;
      border:none;
      margin-bottom:20px;
      float:left;
    }
  }
  p {
    padding-bottom: 18px;
    border:none;
  }
}
.mint-indicator{
  position:relative;
  .mint-indicator-wrapper{
    z-index:9999999;
  }
}
</style>
