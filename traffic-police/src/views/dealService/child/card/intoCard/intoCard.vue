<template>
  <!-- 驾驶证转入组件 -->
  <div class="intoCard-outer">
    <div class="intoCard-form">
      <ul>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>证件名称</span>
          </div>
          <div class="form-line-item">
            <input class="text-input" type="text" value="居民身份证" readonly>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>证件号码</span>
          </div>
          <div class="form-line-item">
            <input v-model="IDcard" class="text-input" type="text" readonly>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>姓名</span>
          </div>
          <div class="form-line-item">
            <input v-model="name" class="text-input" type="text" readonly>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>驾驶证号</span>
          </div>
          <div class="form-line-item">
            <input v-model="driverLicense" class="text-input" type="text" readonly>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>档案编号</span>
          </div>
          <div class="form-line-item">
            <input v-model="fileNumber" class="text-input" type="text" readonly>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>发证机关</span>
          </div>
          <div class="div-select">
            <span class="btn-select" @click.stop="placeSelectClick()">{{ placeSelectMassage }}</span>
            <div class="div-select-ul" v-if="placeSelectShow">
              <ul>
                <li v-for="item in placeSelectData" @click.stop="placeSelectClick(item.longName, item.shortName)">{{item.longName}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>照片回执码</span>
          </div>
          <div class="form-line-item width-60">
            <input class="text-input" v-model="photoReturnNumberString" maxlength="25" type="text" name="" value="" placeholder="请输入照片回执码">
          </div>
          <div class="form-line-item right width-35">
            <span class="btn browse-code" @click="scanQRCode()">扫一扫</span>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span></span>
          </div>
          <div class="form-line-item">
            <span class="photo-ex" @click.stop="example=true">查看示例</span>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>收件人姓名</span>
          </div>
          <div class="form-line-item">
            <input v-model="receiverName" class="text-input" type="text" readonly>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>收件人号码</span>
          </div>
          <div class="form-line-item">
            <input v-model="receiverNumber" class="text-input" type="text" readonly>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>邮寄地址</span>
          </div>
          <div class="form-line-item width-40 city">
            <span>深圳市</span>
          </div>
          <div class="div-select form-line-item width-50">
            <span class="btn-select" @click.stop="areaSelectClick()">{{ areaSelectMassage }}</span>
            <div class="div-select-ul" v-if="areaSelectShow">
              <ul>
                <li v-for="item in areaSelectData" @click.stop="areaSelectClick(item.str, item.id)">{{item.str}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span></span>
          </div>
          <div class="form-line-item">
            <input class="text-input" v-model="mailingAddress" type="text" name="" value="" placeholder="请输入详细地址">
          </div>
        </li>
      </ul>
    </div>
    <userUpload :buttonIsClick="buttonIsClick" :idCard1="true" :idCard2="true" :license="true" :bodyTable="true" @btnSureStar="btnSureStar()" ref="getImgUrl"></userUpload>
    <page-bottom v-if="isWeChat"></page-bottom>
    <div class="example" v-if="example">
      <div class="example-box" @click.stop="example=true">
        <img src="../../../../../images/example.png">
        <button class="btn btn-blue" type="button" name="button" @click.stop="example=!example">关闭</button>
      </div>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
  import { resultPost, resultGet } from '../../../../../service/getData'
  import { intoCard, getIssuing, getFileNumber } from '../../../../../config/baseUrl'
  import { isPhotoNum } from '../../../../../service/regExp.js'
  import { Toast, MessageBox } from 'mint-ui'
  import wx from 'weixin-js-sdk'
  import { mapActions } from 'vuex'
  export default {
    name: 'intoCard',
    computed: {
      isWeChat: function () {
        return /_WeChat/g.test(this.$route.name)
      }
    },
    data () {
      return {
        buttonIsClick: false,
        IDcard: window.localStorage.getItem('identityCard'),
        name: window.localStorage.getItem('userName'),
        driverLicense: window.localStorage.getItem('identityCard'),
        fileNumber: '',                                                   // 档案编号 先从接口查询出再填入
        receiverName: window.localStorage.getItem('userName'),
        receiverNumber: window.localStorage.getItem('mobilePhone'),
        mailingAddress: '',
        photoReturnNumberString: '',
        cur_place_id: '藏A',                                               // 默认发证机关字段
        cur_area_id: '01',                                                 // 默认区名id  01为福田
        placeSelectShow: false,
        placeSelectMassage: '藏A:拉萨市公安局交通警察支队车辆管理所',           // 发证机默认第一条名称
        placeSelectData: '',                                               // 发证机关列表 数据从接口查出
        areaSelectShow: false,
        areaSelectMassage: '福田区',
        areaSelectData: [
          {
            'id': '01',
            'str': '福田区'
          },
          {
            'id': '02',
            'str': '罗湖区'
          },
          {
            'id': '03',
            'str': '南山区'
          },
          {
            'id': '04',
            'str': '宝安区'
          },
          {
            'id': '05',
            'str': '龙岗区'
          },
          {
            'id': '06',
            'str': '盐田区'
          },
          {
            'id': '07',
            'str': '龙华新区'
          },
          {
            'id': '08',
            'str': '光明新区'
          },
          {
            'id': '09',
            'str': '坪山新区'
          },
          {
            'id': '10',
            'str': '大鹏新区'
          }
        ],
        example: false
      }
    },
    components: {
      'userUpload': require('../../userUpload.vue'),
      'pageBottom': require('../../../../../components/pageBottom.vue')
    },
    mounted: function () {
      resultGet(getIssuing).then(json => {        // 查询发证机关列表
        this.placeSelectData = json.data
      })
      let reqData = {                             // 查询档案号
        identityCard: window.localStorage.getItem('identityCard'),
        sourceOfCertification: 'C'
      }
      resultPost(getFileNumber, reqData).then(json => {
        console.log(json)
        if (json.code === '0000') {
          this.fileNumber = json.data.fileNumber
        }
      })
    },
    methods: {
      placeSelectClick: function (str, id) {
        if (str) {
          this.placeSelectMassage = str
          this.cur_place_id = id
        }
        if (this.placeSelectShow === true) {
          this.placeSelectShow = false
        } else {
          this.placeSelectShow = true
        }
      },
      areaSelectClick: function (str, id) {
        if (str) {
          this.areaSelectMassage = str
          this.cur_area_id = id
        }
        if (this.areaSelectShow === true) {
          this.areaSelectShow = false
        } else {
          this.areaSelectShow = true
        }
      },
      scanQRCode: function () {                         // 扫一扫功能
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
          if ((window.Ali.alipayVersion).slice(0, 3) >= 8.1) {
            window.Ali.scan({
              type: 'qr'
            }, function (result) {
              if (result.errorCode) {
                // 没有扫码的情况
                // errorCode=10，用户取消
                // errorCode=11，操作失败
                switch (result.errorCode) {
                  case 10:
                    window.alert('用户取消')
                    break
                  default:
                    window.alert('操作失败')
                }
              } else {
                // 成功扫码的情况
                if (result.barCode !== undefined) { // 条码
                  // result.barCode 返回结果
                  this.photoReturnNumberString = result.barCode
                } else if (result.qrCode !== undefined) { // 二维码
                  // result.barCode 返回结果
                  this.photoReturnNumberString = result.barCode
                } else if (result.cardNumber !== undefined) { // 银行卡
                  // result.barCode 返回结果
                  this.photoReturnNumberString = result.barCode
                }
              }
            })
          } else {
            window.alert('请在钱包8.1以上版本运行')
          }
        }
      },
      btnSureStar: function () {   // 确认提交按钮
        let idImgOne = this.$refs.getImgUrl.imgIDcard1
        let idImgTwo = this.$refs.getImgUrl.imgIDcard2
        let idImgThree = this.$refs.getImgUrl.imgLicense
        let idImgFour = this.$refs.getImgUrl.imgBody

        let idImgOneIf = idImgOne.substr(0, 4) === 'data' || false
        let idImgTwoIf = idImgTwo.substr(0, 4) === 'data' || false
        let idImgThreeIf = idImgThree.substr(0, 4) === 'data' || false
        let idImgFourIf = idImgFour.substr(0, 4) === 'data' || false
        if (!isPhotoNum(this.photoReturnNumberString)) {
          Toast({message: '请输入正确照片回执号', position: 'bottom', className: 'white'})
        } else if (!this.mailingAddress) {
          Toast({message: '请输入详细地址', position: 'bottom', className: 'white'})
        } else if (!idImgOneIf || !idImgTwoIf) {
          Toast({message: '请上传身份证照片', position: 'bottom', className: 'white'})
        } else if (!idImgThreeIf) {
          Toast({message: '请上传驾驶证照片', position: 'bottom', className: 'white'})
        } else if (!idImgFourIf) {
          Toast({message: '请上传身体条件申请表', position: 'bottom', className: 'white'})
        } else {
          let reqData = {
            type: '驾驶证转入',
            url: intoCard,
            textObj: {
              userName: this.name,
              driverLicense: this.driverLicense,
              fileNumber: this.fileNumber,
              identityCard: this.IDcard,
              issuingLicenceAuthorityMsg: this.placeSelectMassage,             // 发证机关传给后端的字段
              photoReturnNumberString: this.photoReturnNumberString,
              receiverName: this.receiverName,
              receiverNumber: this.receiverNumber,
              receiverAddress: '深圳市' + this.areaSelectMassage + this.mailingAddress
            },
            imgObj: {
              PHOTO9: idImgOne.split(',')[1] || '',
              PHOTO10: idImgTwo.split(',')[1] || '',
              JSZZP: idImgThree.split(',')[1] || '',
              STTJSQB: idImgFour.split(',')[1] || ''
            },
            invisibleObj: {
              issuingLicenceAuthority: this.cur_place_id,             // 发证机关传给后端的字段
              loginUser: window.localStorage.getItem('identityCard'),
              userSource: 'C',
              identificationNO: 'A'
            }
          }
          console.log(reqData)
          this.$store.commit('saveMotorVehicleHandling', reqData)
          this.$router.push(this.isWeChat ? '/affirmInfo_WeChat' : '/affirmInfo')
        }
      },
      beforeDestory () {
        Toast.close()
      },
      ...mapActions({
        postAppoin: 'postAppoin'
      })
    },
    created () {
      if (!window.localStorage.getItem('fileNumber')) {
        MessageBox('温馨提示', '您还没绑定驾驶证,请到星级用户中心绑定！')
        this.buttonIsClick = true
      }
      document.addEventListener('click', (e) => {
        this.areaSelectShow = false
        this.placeSelectShow = false
        if (this.example === true) {
          this.example = false
        }
      })
    }
  }
</script>
<style lang="less" scoped>
  .intoCard-outer {
    background-color: #fff;
    position: absolute;
    left: 0;
    right: 0;
    padding: 20px 40px;
    .intoCard-form {
      background-color: #fff;
      padding-top:20px;
      .form-line {
        padding: 20px 0 0 180px;
        position: relative;
        line-height: 56px;
        .form-line-item {
          width: 100%;
          display: inline-block;
          height: 60px;
          line-height:60px;
          .photo-ex {
            color: #2696dd;
            text-decoration: underline;
          }
          span {
            vertical-align: middle;
          }
          .browse-code {
            margin: 0;
            display: inline-block;
            height: 56px;
            width: 100%;
            line-height: 56px;
            border-radius: 10px;
            text-align: center;
            color:#fff;
            vertical-align:middle;
          }
          &.city {
            margin: 0 18px;
          }
        }
        .item-name {
          width: 180px;
          position: absolute;
          left: 0;
        }
        .div-select {
          font-size: 24px;
        }
      }
    }

    .width-40 {
      width: 40% !important;
    }
    .width-35 {
      width: 35% !important;
    }
    .width-50 {
      width: 50% !important;
    }
    .width-60 {
      width: 60% !important;
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
