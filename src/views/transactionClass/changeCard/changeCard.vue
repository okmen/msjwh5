<template>
  <div class="changeCard">
    <div class="changeCard-top">
      <g-input class="changeCard-type" title="业务类型" v-model="name" readonly></g-input>
    </div>
    <g-select title="业务类型" :data="censusTypeList" v-model="censusType"></g-select>
    <g-input title="姓名" v-model="userName"></g-input>
    <g-input title="身份证号" v-model="IDCard"></g-input>
    <g-input title="手机号码" v-model="mobilePhone" type="tel"></g-input>
    <g-input class="changeCard-inputPhoto" title="照片回执码" v-model="photoReturnNumberString" type="tel">
      <div slot='right' class="RichScan" @click="scanQRCode()">扫一扫</div>
    </g-input>
    <span class="changeCard-examine" @click.stop="example=true">查看示例</span>
    <g-select title="户籍所在地" :data="censusRegisterList" v-model="censusRegisterOne"></g-select>
    <g-input title="收件人名字" v-model="receiverName" placeholder="请输入收件人姓名"></g-input>
    <g-input title="收件人号码" v-model="receiverMobilePhone" placeholder="请输入收件人号码"></g-input>
    <g-select-one class="changeCard-set" title="深圳市" type="邮寄地址" :data="areaSelectData" v-model="areaSelect"></g-select-one>
    <g-input title="" v-model="mailingAddress" placeholder="请输入详细地址"></g-input>
    <group title="请按示例图上传以下证件照片">
      <div class="upload-group">
        <g-upload text="身份证（正面)" id="file1" :bg="require('../../../assets/images/IDcard-front.png')" v-model="IDCardFront"></g-upload>
        <g-upload text="身份证（反面)" id="file2" :bg="require('../../../assets/images/IDcard-back.png')" v-model="IDCardBack"></g-upload>
        <g-upload v-if = "censusRegisterOne === '3'" text="审核教育绘制表" id="file3" :bg="require('../../../assets/images/out-board.png')" v-model="board"></g-upload>
      </div>
    </group>
    <g-button text="确认信息" @click.native="confirmInfo"></g-button>
    <!-- 查看示例-弹窗 -->
    <div class="example" v-if="example">
      <div class="example-box" @click.stop="example=true">
        <img src="../../../assets/images/example.png">
        <button class="btn btn-blue" type="button" name="button" @click.stop="example=!example">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
import {GInput, GSelect, GButton, GSelectOne, Group, GUpload} from 'form'
import wx from 'weixin-js-sdk'
export default {
  name: 'changeCard',
  data () {
    return {
      name: '驾驶证补换证',
      userName: '',
      IDCard: '',
      mobilePhone: '',
      photoReturnNumberString: '',
      receiverName: '',
      receiverMobilePhone: '',
      mailingAddress: '',
      IDCardFront: '',
      IDCardBack: '',
      board: '',
      censusTypeList: [
        {name: '补证', value: 0}, {name: '期满换证', value: 1}
      ],
      censusType: 0,
      censusRegisterList: this.$store.state.censusRegisterList,
      censusRegisterOne: this.$store.state.censusRegisterList[0].value,
      areaSelectData: this.$store.state.cityArea,
      areaSelect: this.$store.state.cityArea[0].value,
      example: false                       // 示例弹窗 默认不显示
    }
  },
  components: {
    GInput,
    GSelect,
    GButton,
    GSelectOne,
    Group,
    GUpload
  },
  created () {
    document.addEventListener('click', (e) => {
      if (this.example === true) {
        this.example = false
      }
    })
  },
  methods: {
    scanQRCode: function () {
      let that = this
      let ua = window.navigator.userAgent // 浏览器版本
      if (/MicroMessenger/i.test(ua)) {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
            that.photoReturnNumberString = result.split(',')[1]
          }
        })
      } else {
        // if ((window.Ali.alipayVersion).slice(0, 3) >= 8.1) {
        //   window.Ali.scan({
        //     type: 'qr'
        //   }, function (result) {
        //     if (result.errorCode) {
        //       // 没有扫码的情况
        //       // errorCode=10，用户取消
        //       // errorCode=11，操作失败
        //       switch (result.errorCode) {
        //         case 10:
        //           window.alert('用户取消')
        //           break
        //         default:
        //           window.alert('操作失败')
        //       }
        //     } else {
        //       // 成功扫码的情况
        //       if (result.barCode !== undefined) { // 条码
        //         // result.barCode 返回结果
        //         this.photoReturnNumberString = result.barCode
        //       } else if (result.qrCode !== undefined) { // 二维码
        //         // result.barCode 返回结果
        //         this.photoReturnNumberString = result.barCode
        //       } else if (result.cardNumber !== undefined) { // 银行卡
        //         // result.barCode 返回结果
        //         this.photoReturnNumberString = result.barCode
        //       }
        //     }
        //   })
        // } else {
        //   window.alert('请在钱包8.1以上版本运行')
        // }
      }
    },
    confirmInfo () {
      if (!this.userName) {
      }
    }
  }
}
</script>

<style lang="less" scoped>
.changeCard {
  position:relative;
  .upload-group{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .RichScan {
    width: 24%;
    line-height: 56px;
    border-radius: 8px;
    text-align: center;
    background-color: #09bb07;
    color: #fff;
    margin-left: 16px;
  }
  .changeCard-examine {
    padding-left: 240px;
    line-height: 70px;
    color: #2696dd;
    text-decoration: underline;
  }
  .example {
    position: absolute;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.5);
    .example-box {
      left: 5%;
      right:5%;
      top:50%;
      height: 500px;
      background-color: #fff;
      position: absolute;
      margin-top: -480px;
      border-radius: 10px;
      text-align: center;
      padding: 60px;
      img {
        width: 440px;
      }
      .btn {
        width: 280px;
        margin-top:30px;
        display: inline-block;
      }
    }
  }
}
</style>