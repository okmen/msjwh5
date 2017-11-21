<template>
  <div class="upload-img">
    <p>请按示例图上传以下证件照片</p>
    <div class="container">
      <label class="img-box style-one" for="file1" v-show="idCard1">
        <input id="file1" type="file" accept="image/*">
        <img :src="imgIDcard1">
        <span>身份证（正面）</span>
      </label>
      <label class="img-box style-two" for="file2" v-show="idCard2">
        <input id="file2" type="file" accept="image/*">
        <img :src="imgIDcard2">
        <span>身份证（反面）</span>
      </label>
      <label class="img-box style-three" for="file3" v-show="license">
        <input id="file3" type="file" accept="image/*">
        <img :src="imgLicense">
        <span>驾驶证照片</span>
      </label>
      <label class="img-box style-four" for="file4" v-show="eduTable">
        <input id="file4" type="file" accept="image/*">
        <img :src="imgEducate">
        <span>审核教育绘制表</span>
      </label>
      <label class="img-box style-five" for="file5" v-show="outTable">
        <input id="file5" type="file" accept="image/*">
        <img :src="imgOut">
        <span>境外人员临住表</span>
      </label>
      <label class="img-box style-six" for="file6" v-show="delay">
        <input id="file6" type="file" accept="image/*">
        <img :src="imgDelay">
        <span>延期说明照片</span>
      </label>
      <label class="img-box style-seven" for="file7" v-show="bodyTable">
        <input id="file7" type="file" accept="image/*">
        <img :src="imgBody">
        <span>身体条件申请表</span>
      </label>
    </div>
    <button class="btn" :class="{'gray':buttonIsClick}" type="button" name="button" @click="btnSureStar">确认信息</button>
  </div>
</template>
<script>
  import UploadFile from '../../../service/uploadFile'
  export default {
    name: 'upload-img',
    data () {
      return {
        imgIDcard1: require('../../../images/IDcard-front.png'),  // 身份证正面
        imgIDcard2: require('../../../images/IDcard-back.png'),  // 身份证反面
        imgLicense: require('../../../images/drivinglicense.png'),  // 驾驶证照片
        imgEducate: require('../../../images/edu-table.png'),  // 审核教育绘制表
        imgOut: require('../../../images/out-board.png'),      // 境外人员临住表
        imgDelay: require('../../../images/newDelayIntro.png'),    // 延期说明照片
        imgBody: require('../../../images/body-table.png')      // 身体条件申请表
      }
    },
    props: ['idCard1', 'idCard2', 'license', 'eduTable', 'outTable', 'delay', 'bodyTable', 'buttonIsClick'],
    mounted: function () {
      console.log(this.outTable)
      this.init()
    },
    watch: {
      outTable: function () {
        console.log('222222222')
        this.init()
      }
    },
    methods: {
      init: function () {
        UploadFile.upload({
          id: 'file1',
          callback: (res) => {
            console.log(res)
            this.imgIDcard1 = res.imgUrl
          }
        })
        UploadFile.upload({
          id: 'file2',
          callback: (res) => {
            console.log(res)
            this.imgIDcard2 = res.imgUrl
          }
        })
        if (this.outTable) {
          UploadFile.upload({
            id: 'file5',
            callback: (res) => {
              console.log(res)
              this.imgOut = res.imgUrl
            }
          })
        }
        if (this.license) {
          UploadFile.upload({
            id: 'file3',
            callback: (res) => {
              console.log(res)
              this.imgLicense = res.imgUrl
            }
          })
        }
        if (this.eduTable) {
          UploadFile.upload({
            id: 'file4',
            callback: (res) => {
              console.log(res)
              this.imgEducate = res.imgUrl
            }
          })
        }
        if (this.delay) {
          UploadFile.upload({
            id: 'file6',
            callback: (res) => {
              console.log(res)
              this.imgDelay = res.imgUrl
            }
          })
        } if (this.bodyTable) {
          UploadFile.upload({
            id: 'file7',
            callback: (res) => {
              console.log(res)
              this.imgBody = res.imgUrl
            }
          })
        }
      },
      btnSureStar: function () {
        if (!this.buttonIsClick) {
          this.$emit('btnSureStar')
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .gray{
    background: gray;
  }
  .upload-img {
    margin-top: 40px;
    background-color: #FFF;
    padding-bottom: 50px;
    position: relative;
    .container {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .img-box {
        margin-bottom: 90px;
        display: inline-block;
        position: relative;
        width: 304px;
        height: 304px;
        background-color: #efeff4;
        border-radius: 8px;
        border: 2px solid #dddde1;
        color: #666;
        font-size: 22px;
        text-align: center;
        img {
          position: absolute;
          max-height: 90%;
          max-width: 90%;
          border-radius: 8px;
          top: 50%;
          left: 50%;
          transform:translate(-50%,-50%);
        }
        input {
          position: absolute;
          width: 100%;
          height: 100%;
          visibility: hidden;
          top: 0;
          left: 0;
          z-index: 998;
        }
        span{
          display: block;
          width: 304px;
          position: absolute;
          top: 325px;
          text-align: center;
          font-size: 28px;
        }
      }
      .img-box:nth-of-type(2n) {
        margin-right: 0;
      }
      .img-box:nth-of-type(1), .img-box:nth-of-type(2){
        margin-top: 24px;
      }
      /* .style-one {
        background: #efeff4 url('../../../images/IDcard-front.png') center no-repeat;
        background-size: 90%;
        border: none;
      }
      .style-two {
        background: #efeff4 url('../../../images/IDcard-back.png') center no-repeat;
        background-size: 90%;
        border: none;
      }
      .style-three {
        background: #efeff4 url('../../../images/drivinglicense.png') center no-repeat;
        background-size: 70%;
        border: none;
      }
      .style-four {
        background: #efeff4 url('../../../images/edu-table.png') center no-repeat;
        background-size: 80%;
        border: none;
      }
      .style-five {
        background: #efeff4 url('../../../images/out-board.png') center no-repeat;
        background-size: 80%;
        border: none;
      }
      .style-six {
        background: #efeff4 url('../../../images/newDelayIntro.png') center no-repeat;
        background-size: 80%;
        border: none;
      }
      .style-seven {
        background: #efeff4 url('../../../images/body-table.png') center no-repeat;
        background-size: 80%;
        border: none;
      } */
    }
  }
</style>
