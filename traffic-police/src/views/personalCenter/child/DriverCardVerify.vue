<template>
  <div class="takePicturesQuery-outer">
    <div class="takePicturesQuery-from pad-side-50">
      <div id="takePicturesQuery-hbs">
        <div class="title">操作类型：驾驶证认证</div>
        <ul class="takePicturesQuery-hbs-list">
          <li class="takePicturesQuery-hbs-item">
            <div class="takePicturesQuery-hbs-name">
              <span>我的姓名</span>
            </div>
            <div class="takePicturesQuery-hbs-text">
              <input v-model="name" class="text-input" type="text" name="" value="" placeholder="请输入姓名" readonly>
            </div>
          </li>
          <li class="takePicturesQuery-hbs-item">
            <div class="takePicturesQuery-hbs-name">
              <span>身份证号</span>
            </div>
            <div class="takePicturesQuery-hbs-text">
              <input v-model="identityCard" class="text-input" type="tel" name="" value="" placeholder="请输入身份证号" readonly>
            </div>
          </li>
        </ul>
        <div class="check-box">
          <span class="check-title">驾驶证核发地</span>
          <div class="item">
            <span :class="{ active: setLocalCity }" @click="setLocalCity=true; setOutCity=false; setOutProvince=false"></span>
            本地
          </div>
          <div class="item">
            <span :class="{ active: setOutCity }" @click="setOutCity=true; setLocalCity=false; setOutProvince=false"></span>
            本省外市
          </div>
          <div class="item">
            <span :class="{ active: setOutProvince }" @click="setOutProvince=true; setOutCity=false; setLocalCity=false"></span>
            外省
          </div>
        </div>
      </div>
      <button class="btn" type="button" name="button" @click="nextStep()">下一步</button>
    </div>
  </div>
</template>
<script>
  import { resultPost } from '../../../service/getData'
  import { DriverCardVerify } from '../../../config/baseUrl'
  import { Toast } from 'mint-ui'
  import { mapActions } from 'vuex'
  export default {
    name: 'takePicturesQuery',
    data () {
      return {
        setLocalCity: true,
        setOutCity: false,
        setOutProvince: false,
        driverLicenseIssuedAddress: '',
        identityCard: window.localStorage.identityCard,
        name: window.localStorage.userName,
        recordNumber: ''
      }
    },
    methods: {
      nextStep: function () {
        if (this.setLocalCity === true) {
          this.driverLicenseIssuedAddress = 1
        } else if (this.setOutCity === true) {
          this.driverLicenseIssuedAddress = 2
        } else {
          this.driverLicenseIssuedAddress = 3
        }
        let reqData = {
          loginName: window.localStorage.identityCard,
          Intype: '0',
          identityCard: this.identityCard,
          userSource: 'C',
          driverLicenseIssuedAddress: this.driverLicenseIssuedAddress,
          name: this.name,
          sourceOfCertification: 'C'
        }
        console.log(reqData)
        resultPost(DriverCardVerify, reqData).then(json => {
          console.log(json)
          if (!json.data) {
            Toast({
              message: json.msg,
              position: 'middle',
              className: 'white',
              duration: 3000
            })
          } else if (json.code === '0000') {
            this.recordNumber = json.data.recordNumber
            this.postAppoin({
              appoinNum: json.data.recordNumber,
              appoinType: '绑定驾驶证'
            })
            this.$router.push('/appointSuccess')
          }
        })
      },
      ...mapActions({
        postAppoin: 'postAppoin'
      })
    }
  }
</script>
<style lang="less" scoped>
  .takePicturesQuery-outer {
    padding: 40px;
    position: relative;
    background-color: white;
    .title {
      padding: 20px 0;
    }
    .takePicturesQuery-from {
      background-color: #fff;
      #takePicturesQuery-hbs {
        padding-bottom: 20px;
        .takePicturesQuery-hbs-list {
          overflow: hidden;
          .takePicturesQuery-hbs-item {
            margin-top: 24px;
            padding-left: 180px;
            position: relative;
            line-height: 56px;
            .takePicturesQuery-hbs-name {
              width: 180px;
              position: absolute;
              left: 0;
            }
            .takePicturesQuery-hbs-text {
              width: 100%;
              display: inline-block;
            }
          }
        }
        .check-box {
          padding-top: 40px;
          .check-title {
            margin-right: 20px;
          }
          .item {
            display: inline-block;
            margin-right: 16px;
            span {
              display: inline-block;
              width: 30px;
              height: 30px;
              background-color: #d0d0d0;
              vertical-align: -4px;
              &.active {
                background-image: url("../../../images/checked.png");
                background-size: cover;
              }
            }
          }
        }
      }
    }
  }
</style>

