<template>
  <div class="starUser-upload">
    <p>请上传以下照片</p>
    <div class="starUser-upload-inner">
      <label class="starUser-upload-left starUser-upload-box" for="file1">
        <input id="file1" type="file" accept="image/*" >
        <img :src="idCardImgPositive">
      </label>
      <label class="starUser-upload-center starUser-upload-box" for="file2">
        <input id="file2" type="file" accept="image/*" >
        <img :src="idCardImgNegative">
      </label>
      <label class="starUser-upload-right starUser-upload-box" for="file3">
        <input id="file3" type="file" accept="image/*" >
        <img :src="idCardImgHandHeld">
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
      idCardImgPositive: '',        // 身份证正面
      idCardImgNegative: '',        // 身份证反面
      idCardImgHandHeld: ''         // 手持身份证
    }
  },
  mounted: function () {
    this.init()
  },
  methods: {
    init: function () {
      UploadFile.upload({
        id: 'file1',
        callback: (res) => {
          console.log(res)
          this.idCardImgPositive = res.imgUrl
        }
      })
      UploadFile.upload({
        id: 'file2',
        callback: (res) => {
          console.log(res)
          this.idCardImgNegative = res.imgUrl
        }
      })
      UploadFile.upload({
        id: 'file3',
        callback: (res) => {
          console.log(res)
          this.idCardImgHandHeld = res.imgUrl
        }
      })
    },
    btnSureStar: function () {
      this.$emit('btnSureStar')
    }
  }
}
</script>
<style lang="less">
.starUser-upload {
  background-color:#FFF;
  padding-bottom:50px;
  position: relative;
  .starUser-upload-inner {
    display: flex;
    justify-content: space-between;
    .starUser-upload-box {
      position:relative;
      width: 190px;
      height: 190px;
      background-color: #efeff4;
      border: 1px solid #dddde1;
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
      background:#efeff4 url('../../../images/idImgOne.png') center no-repeat;
      background-size: 90%;
      border:none;
    }
    .starUser-upload-center {
      background:#efeff4 url('../../../images/idImgTwo.png') center no-repeat;
      background-size: 90%;
      border:none;
    }
    .starUser-upload-right {
      background:#efeff4 url('../../../images/idImgThree.png') center no-repeat;
      background-size: 90%;
      border:none;
    }
  }
  p {
    padding-bottom: 18px;
    border:none;
  }
}
</style>
