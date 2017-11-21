<template>
  <!-- 补换证组件 -->
  <div class="changeNormal-outer">
    <div class="changeNormal-form">
      <ul>
        <!-- 补换证下拉框子菜单 -->
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>业务类型</span>
          </div>
          <div class="div-select">
            <span class="btn-select" @click.stop="serviceSelectClick()">{{ serviceSelectMassage }}</span>
            <div class="div-select-ul" v-if="serviceSelectShow">
              <ul>
                <li v-for="item in serviceSelectData" @click.stop="serviceSelectClick(item.str, item.id)">{{item.str}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>姓名</span>
          </div>
          <div class="form-line-item">
            <input v-model="name" class="text-input" type="text" name="" value="" placeholder="请输入姓名">
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>身份证号</span>
          </div>
          <div class="form-line-item">
            <input v-model="IDcard" class="text-input" maxlength="18" type="text" name="" value="" placeholder="请输入身份证号">
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>手机号码</span>
          </div>
          <div class="form-line-item">
            <input v-model="mobilephone" class="text-input" maxlength="11" type="text" name="" value="" placeholder="请输入手机号码">
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>照片回执码</span>
          </div>
          <div class="form-line-item width-60">
            <input v-model="photoReturnNumberString" maxlength="25" class="text-input" type="text" name="" value="" placeholder="请输入照片回执码">
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
            <span>户籍所在地</span>
          </div>
          <div class="div-select">
            <span class="btn-select" @click.stop="placeSelectClick()">{{ placeSelectMassage }}</span>
            <div class="div-select-ul" v-if="placeSelectShow">
              <ul>
                <li v-for="item in placeSelectData" @click.stop="placeSelectClick(item.str, item.id)">{{item.str}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>收件人姓名</span>
          </div>
          <div class="form-line-item">
            <input v-model="receiverName" class="text-input" type="text" name="" placeholder="请输入收件人姓名">
          </div>
        </li>
        <li class="form-line">
          <div class="form-line-item item-name">
            <span>收件人号码</span>
          </div>
          <div class="form-line-item">
            <input v-model="receiverNumber" class="text-input" type="tel" name="" placeholder="请输入收件人号码">
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
            <input v-model="mailingAddress" class="text-input" type="text" name="" value="" placeholder="请输入详细地址">
          </div>
        </li>
      </ul>
    </div>
    <userUpload :idCard1="true" :idCard2="true" :outTable="outTable" @btnSureStar="btnSureStar()" ref="getImgUrl"></userUpload>
    <!-- 查看示例-弹窗 -->
    <div class="example" v-if="example">
      <div class="example-box" @click.stop="example=true">
        <img src="../../../../../images/example.png">
        <button class="btn btn-blue" type="button" name="button" @click.stop="example=!example">关闭</button>
      </div>
    </div>
  </div>
</template>
<script>
  // import { resultPost } from '../../../../../service/getData'
  import { cardRepair, cardReplace } from '../../../../../config/baseUrl'
  import { isPhone, isPhotoNum } from '../../../../../service/regExp.js'
  import { Toast, MessageBox } from 'mint-ui'
  import { mapActions } from 'vuex'
  import wx from 'weixin-js-sdk'
  export default {
    name: 'changeNormal',
    data () {
      return {
        IDcard: window.localStorage.getItem('identityCard'),
        name: window.localStorage.getItem('userName'),
        mobilephone: window.localStorage.getItem('mobilePhone'),
        photoReturnNumberString: '',                                // 照片回执号
        receiverName: '',
        receiverNumber: '',
        mailingAddress: '',
        cur_place_id: '1',                                          // 默认户籍所在地id  1为深圳
        cur_area_id: '01',                                          // 默认区名id  01为福田区
        cur_service_id: '1',                                        // 默认业务类型id  1为补证
        serviceSelectShow: false,
        serviceSelectMassage: '补证',
        serviceSelectData: [
          {
            'id': '1',
            'str': '补证'
          },
          {
            'id': '2',
            'str': '期满换证'
          }
        ],
        placeSelectShow: false,
        placeSelectMassage: '深圳',
        placeSelectData: [
          {
            'id': '1',
            'str': '深圳'
          },
          {
            'id': '2',
            'str': '港澳台籍'
          },
          {
            'id': '3',
            'str': '外国籍'
          },
          {
            'id': '4',
            'str': '其他'
          }
        ],
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
        example: false,                                             // 示例弹窗 默认不显示
        outTable: false                                             // 境外人员临住表 默认不显示
      }
    },
    components: {
      'userUpload': require('../../userUpload.vue')
    },
    methods: {
      placeSelectClick: function (str, id) {                        // 户籍地选择
        if (str) {
          this.placeSelectMassage = str
          this.cur_place_id = id
          if (this.cur_place_id === '3') {                          // 当选择户籍为外国籍时 显示境外人员临住表上传
            this.outTable = true
          } else {
            this.outTable = false
          }
        }
        if (this.placeSelectShow === true) {
          this.placeSelectShow = false
        } else {
          this.placeSelectShow = true
        }
      },
      areaSelectClick: function (str, id) {                        // 区域选择
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
      serviceSelectClick: function (str, id) {                      // 业务类型选择
        if (str) {
          this.serviceSelectMassage = str
          this.cur_service_id = id
          console.log(this.cur_service_id)
        }
        if (this.serviceSelectShow === true) {
          this.serviceSelectShow = false
        } else {
          this.serviceSelectShow = true
        }
      },
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
        let idImgThree = this.$refs.getImgUrl.imgOut

        let idImgOneIf = idImgOne.substr(0, 4) === 'data' || false
        let idImgTwoIf = idImgTwo.substr(0, 4) === 'data' || false
        let idImgThreeIf = idImgThree.substr(0, 4) === 'data' || false
        if (!this.name) {
          Toast({message: '请输入姓名', position: 'bottom', className: 'white'})
        } else if (!this.IDcard) {
          Toast({message: '请输入身份证号码', position: 'bottom', className: 'white'})
        } else if (!isPhone(this.mobilephone)) {
          Toast({message: '请输入正确手机号码', position: 'bottom', className: 'white'})
        } else if (!isPhotoNum(this.photoReturnNumberString)) {
          Toast({message: '请输入正确照片回执码', position: 'bottom', className: 'white'})
        } else if (!this.receiverName) {
          Toast({message: '请输入收件人姓名', position: 'bottom', className: 'white'})
        } else if (!isPhone(this.receiverNumber)) {
          Toast({message: '请输入正确收件人号码', position: 'bottom', className: 'white'})
        } else if (!this.mailingAddress) {
          Toast({message: '请输入详细地址', position: 'bottom', className: 'white'})
        } else if (!idImgOneIf || !idImgTwoIf) {
          Toast({message: '请上传身份证照片', position: 'bottom', className: 'white'})
        } else if (!idImgThreeIf && this.cur_place_id === '3') {
          Toast({message: '请上传境外人员临住表', position: 'bottom', className: 'white'})
        } else {
          // Indicator.open('提交中...') // 图片转换为base64后提交会需要时间
          let reqData = {  //  补证2个非必要字段 reason postcode  换证1个 postcode
            type: '驾驶证补证',
            url: this.cur_service_id === '1' ? cardRepair : cardReplace,
            textObj: {
              identityCard: this.IDcard,
              userName: this.name,
              mobilephone: this.mobilephone,
              photoReturnNumberString: this.photoReturnNumberString,
              placeOfDomicile: this.cur_place_id,
              receiverName: this.receiverName,
              receiverNumber: this.receiverNumber,
              receiverAddress: '深圳市' + this.areaSelectMassage + this.mailingAddress
            },
            imgObj: {
              PHOTO9: idImgOne.split(',')[1] || '',
              PHOTO10: idImgTwo.split(',')[1] || '',
              PHOTO31: idImgThree.split(',')[1] || ''
            },
            invisibleObj: {
              JZZA: idImgOne.split(',')[1] || '',      // 居住证照片 页面不给居住证上传入口 直接传与身份证正反面同样的数据
              JZZB: idImgTwo.split(',')[1] || '',
              loginUser: window.localStorage.getItem('identityCard'),
              userSource: 'C',
              identificationNO: 'A'
            }
          }
          console.log(reqData)
          this.$store.commit('saveMotorVehicleHandling', reqData)
          this.$router.push(/_WeChat/g.test(this.$route.name) ? '/affirmInfo_WeChat' : '/affirmInfo')
        //   if (this.cur_service_id === '4') {                  // 补证服务
        //     resultPost(cardRepair, reqData).then(json => {
        //       console.log(json)
        //       if (json.code === '0000') {
        //         Indicator.close()
        //         this.postAppoin({
        //           appoinNum: json.msg.split('：')[1],
        //           appoinType: '驾驶证补证'
        //         })
        //         this.$router.push('/appointSuccess_WeChat')
        //       } else {
        //         Indicator.close()
        //         Toast({
        //           message: json.msg,
        //           position: 'bottom',
        //           className: 'white'
        //         })
        //       }
        //     })
        //   } else if (this.cur_service_id === '5') {            // 换证服务
        //     resultPost(cardReplace, reqData).then(json => {
        //       console.log(json)
        //       if (json.code === '0000') {
        //         Indicator.close()
        //         this.postAppoin({
        //           appoinNum: json.msg.split('：')[1],
        //           appoinType: '驾驶证换证'
        //         })
        //         this.$router.push('/appointSuccess_WeChat')
        //       } else {
        //         Indicator.close()
        //         Toast({
        //           message: json.msg,
        //           position: 'bottom',
        //           className: 'white'
        //         })
        //       }
        //     })
        //   }
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
      }
      document.addEventListener('click', (e) => {
        this.placeSelectShow = false
        this.areaSelectShow = false
        if (this.example === true) {
          this.example = false
        }
      })
    }
  }
</script>
<style lang="less" scoped>
  .changeNormal-outer {
    background-color: #fff;
    padding: 0 40px;
    .changeNormal-form {
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
          &.city {
            margin: 0 18px;
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
            .code-icon {
              background-size: 32px 32px;
              display: inline-block;
              width:32px;
              height: 32px;
              vertical-align: -6px;
              margin-right: 10px;
            }
          }
        }
        .item-name {
          width: 180px;
          position: absolute;
          left: 0;
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
