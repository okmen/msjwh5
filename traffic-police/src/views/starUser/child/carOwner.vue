<template>
  <div>
    <div id="starUser-hbs">
      <ul class="starUser-hbs-list">
        <li class="starUser-hbs-item">
          <div class="starUser-hbs-name">
            <span>车牌类型</span>
          </div>
          <div class="div-select">
            <span class="btn-select" @click.stop="licenseSelectClick()" data-type="licenseSelectType">{{ licenseSelectMassage }}</span>
            <div class="div-select-ul" v-if="licenseSelectShow">
              <ul>
                <li v-for="(item, index) in licenseSelectData" @click.stop = "licenseSelectClick(item.str, index)">{{item.str}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="starUser-hbs-item clear">
          <div class="starUser-hbs-name">
            <span>车牌号码</span>
          </div>
          <div class="div-select width-120 left">
            <span class="btn-select min-btn-select" @click.stop="abbreviationSelectClick()">{{ abbreviationSelectMassage }}</span>
            <div class="div-select-ul" v-if="abbreviationSelectShow">
              <ul>
                <li v-for="item in abbreviationSelectData" @click.stop = "abbreviationSelectClick(item.str)">{{item.str}}</li>
              </ul>
            </div>
          </div>
          <div class="starUser-hbs-text width-70 right">
            <input class="text-input" type="text" maxlength="10" v-model="carNumber">
          </div>
        </li>
        <li class="starUser-hbs-item">
          <div class="starUser-hbs-name">
            <span>身份证号</span>
          </div>
          <div class="starUser-hbs-text">
            <input class="text-input" type="text" maxlength="19" v-model="idCardNumber" placeholder="外籍人士,请在证件号前加F">
          </div>
        </li>
        <li class="starUser-hbs-item">
          <div class="starUser-hbs-name">
            <span>联系地址</span>
          </div>
          <div class="starUser-hbs-text">
            <input class="text-input" type="text" maxlength="18" v-model="connectAddress" placeholder="请输入您的联系地址(非必填)">
          </div>
        </li>
        <li class="starUser-hbs-item">
        <div class="starUser-hbs-name">
          <span>手机号码</span>
        </div>
        <div class="starUser-hbs-text">
          <input class="text-input" type="tel" maxlength="11" v-model="telphone" placeholder="请输入您的手机号码">
        </div>
      </li>
      <li class="starUser-hbs-item clear">
        <div class="starUser-hbs-name">
          <span>验证码</span>
        </div>
        <div class="starUser-hbs-text width-40 left">
          <input class="text-input" type="tel" maxlength="6" v-model="validCode" placeholder="请输入验证码">
        </div>
        <div class="left starUser-hbs-code">
          <button type="button" name="button" @click.stop="getVerification()"
            :class="{disabled: isdisabled}" v-bind:disabled="this.isdisabled">{{getValidCodeMsg}}
          </button>
        </div>
      </li>
        <li class="starUser-hbs-item">
          <div class="starUser-hbs-name">
            <span>是否有驾驶证</span>
          </div>
          <div class="starUser-hbs-radio">
            <div class="starUser-hbs-radio-box">
              <input type="radio" id="starUserRadio4" name="haveDrivingLicence"
                v-model:checked="haveDrivingLicence" value="1">
              <label name="starUserRadio4" class="checked" for="starUserRadio4">有</label>
            </div>
            <div class="starUser-hbs-radio-box">
              <input type="radio" id="starUserRadio5" name="haveDrivingLicence" value="0" v-model:checked="haveDrivingLicence">
              <label name="starUserRadio5" class="checked" for="starUserRadio5">无</label>
            </div>
          </div>
        </li>
        <li class="starUser-hbs-item" v-show="haveDrivingLicence == 1">
          <div class="starUser-hbs-name">
            <span>驾驶证核发地</span>
          </div>
          <div class="starUser-hbs-radio">
            <div class="starUser-hbs-radio-box">
              <input type="radio" id="starUserRadio1" name="drivingLicence" value="1" v-model:checked="originPlace">
              <label name="starUserRadio1" class="checked" for="starUserRadio1">深圳本地</label>
            </div>
            <div class="starUser-hbs-radio-box">
              <input type="radio" id="starUserRadio2" name="drivingLicence" value="2" v-model:checked="originPlace">
              <label name="starUserRadio2" class="checked" for="starUserRadio2">本省外市</label>
            </div>
            <div class="starUser-hbs-radio-box">
              <input type="radio" id="starUserRadio3" name="drivingLicence" value="3" v-model:checked="originPlace">
              <label name="starUserRadio3" class="checked" for="starUserRadio3">外省</label>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <common @btnSureStar="btnSureStar()" ref="getImgUrl"></common>
  </div>
</template>
<script>
import common from './common'
import { resultPost } from '../../../service/getData'
import { carOwner, sendSMS } from '../../../config/baseUrl'
import { Toast, Indicator } from 'mint-ui'
import { mapActions } from 'vuex'
export default{
  name: 'carOwner',
  components: {
    common
  },
  data () {
    return {
      isdisabled: false,
      getValidCodeMsg: '发送验证码',
      licenseSelectShow: false,
      licenseSelectMassage: '蓝牌',
      licenseSelectType: '02',
      licenseSelectData: [
        {
          'str': '蓝牌',
          'type': '02'
        },
        {
          'str': '黄牌',
          'type': '01'
        },
        {
          'str': '黑牌',
          'type': '06'
        },
        {
          'str': '个性牌',
          'type': '02'
        },
        {
          'str': '小型新能源车号牌',
          'type': '52'
        },
        {
          'str': '大型新能源车号牌',
          'type': '51'
        }
      ],
      abbreviationSelectShow: false,
      abbreviationSelectMassage: '粤',
      abbreviationSelectData: [
        {
          'str': '粤'
        },
        {
          'str': '鄂'
        },
        {
          'str': '豫'
        },
        {
          'str': '皖'
        },
        {
          'str': '赣'
        },
        {
          'str': '冀'
        },
        {
          'str': '鲁'
        },
        {
          'str': '浙'
        },
        {
          'str': '苏'
        },
        {
          'str': '湘'
        },
        {
          'str': '闽'
        },
        {
          'str': '蒙'
        },
        {
          'str': '京'
        },
        {
          'str': '辽'
        },
        {
          'str': '渝'
        },
        {
          'str': '沪'
        },
        {
          'str': '陕'
        },
        {
          'str': '川'
        },
        {
          'str': '黑'
        },
        {
          'str': '晋'
        },
        {
          'str': '桂'
        },
        {
          'str': '吉'
        },
        {
          'str': '宁'
        },
        {
          'str': '贵'
        },
        {
          'str': '琼'
        },
        {
          'str': '甘'
        },
        {
          'str': '青'
        },
        {
          'str': '津'
        },
        {
          'str': '云'
        },
        {
          'str': '藏'
        },
        {
          'str': '新'
        }
      ],
      carNumber: 'B',         // 车牌号
      idCardNumber: '',       // 身份证号
      connectAddress: '',     // 联系地址
      telphone: '',           // 手机号码
      validCode: '',          // 验证码
      haveDrivingLicence: '1', // 是否有驾驶证
      originPlace: ''         // 所属地
    }
  },
  methods: {
    licenseSelectClick: function (str, index) {
      if (str) {
        this.licenseSelectMassage = str
        this.licenseSelectType = this.licenseSelectData[index].type
      }
      if (this.licenseSelectShow === true) {
        this.licenseSelectShow = false
      } else {
        this.licenseSelectShow = true
        this.typeSelectShow = false
        this.abbreviationSelectShow = false
      }
    },
    abbreviationSelectClick: function (str) {
      if (str) {
        this.abbreviationSelectMassage = str
      }
      if (this.abbreviationSelectShow === true) {
        this.abbreviationSelectShow = false
      } else {
        this.abbreviationSelectShow = true
        this.licenseSelectShow = false
        this.typeSelectShow = false
      }
    },
    btnSureStar: function () {  // 提交按钮
      let platNo = this.abbreviationSelectMassage + this.carNumber
      let idImgOne = this.$refs.getImgUrl.idCardImgPositive
      let idImgTwo = this.$refs.getImgUrl.idCardImgNegative
      let idImgThree = this.$refs.getImgUrl.idCardImgHandHeld
      if (this.$plateerification(platNo.toLocaleUpperCase())) {
        Toast({
          message: this.$plateerification(platNo.toLocaleUpperCase()),
          position: 'bottom',
          className: 'white'
        })
        return
      } else if (/[（* | ）* ]/g.test(this.idCardNumber)) {
        Toast({message: '请使用英文状态下的括号', position: 'bottom', className: 'white'})
      } else if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+$/gi.test(this.carNumber))) {
        Toast({message: '车牌号不能输入特殊字符', position: 'bottom', className: 'white'})
      } else if (!this.idCardNumber) {
        Toast({message: '请输入身份证号', position: 'bottom', className: 'white'})
      } else if (!this.telphone) {
        Toast({message: '请输入您的手机号码', position: 'bottom', className: 'white'})
      } else if (!this.validCode) {
        Toast({message: '请输入验证码', position: 'bottom', className: 'white'})
      } else if (!idImgOne || !idImgTwo || !idImgThree) {
        Toast({message: '请上传身份证照片', position: 'bottom', className: 'white'})
      } else {
        Indicator.open('提交中...') // 图片转换为base64后提交会需要时间
        let carOwnerData = {
          licensePlateType: this.licenseSelectType,
          licensePlateNumber: this.carNumber.toLocaleUpperCase(),
          identityCard: this.idCardNumber,
          linkAddress: this.connectAddress,
          mobilephone: this.telphone,
          validateCode: this.validCode,
          isDriverLicense: this.haveDrivingLicence,
          driverLicenseIssuedAddress: this.originPlace,
          idCardImgPositive: idImgOne.split(',')[1],
          idCardImgNegative: idImgTwo.split(',')[1],
          idCardImgHandHeld: idImgThree.split(',')[1],
          provinceAbbreviation: this.abbreviationSelectMassage,
          openId: window.localStorage.openId,
          businessType: ''
        }
        console.log(carOwnerData)
        resultPost(carOwner, carOwnerData).then(json => {
          let jsonMsg = json.msg
          let getJsonMsg = ''
          if (jsonMsg.indexOf(' ') === -1) {
            getJsonMsg = jsonMsg
          } else {
            getJsonMsg = jsonMsg.split(' ')[0]
          }
          if (json.code === '0000') {
            Indicator.close()
            this.postAppoin({
              appoinNum: json.msg.split(':')[1],
              appoinType: '星级用户认证'
            })
            this.$router.push('/appointSuccess')
          } else {
            Indicator.close()
            Toast({
              message: getJsonMsg,
              position: 'bottom',
              className: 'white'
            })
          }
        })
      }
    },
    getVerification: function () {  // 发送验证码 按钮
      let sendPhoneNumber = {
        mobilephone: this.telphone,
        businessType: 'szjj'
      }
      let time = 30
      if (/^1[34578]\d{9}$/.test(this.telphone)) {
        this.getValidCodeMsg = `已发送（${time}）`
        this.isdisabled = true
        countDown(this)
        resultPost(sendSMS, sendPhoneNumber).then(json => {
          if (json.code === '0000') {
            Toast({
              message: '验证码已发送，请查收',
              position: 'bottom',
              className: 'white',
              duration: 1500
            })
          }
        })
      } else {
        Toast({
          message: '请输入正确的手机号码',
          position: 'bottom',
          className: 'white',
          duration: 1500
        })
      }
      function countDown (that) {
        setTimeout(() => {
          if (time === 0) {
            that.isdisabled = false
            that.getValidCodeMsg = '发送验证码'
          } else {
            time--
            that.getValidCodeMsg = `已发送（${time}）`
            countDown(that)
          }
        }, 1000)
      }
    },
    ...mapActions({
      postAppoin: 'postAppoin'
    })
  },
  created () {
    document.addEventListener('click', (e) => {
      this.typeSelectShow = false
      this.licenseSelectShow = false
      this.abbreviationSelectShow = false
    })
  }
}
</script>
<style lang="less">
#starUser-hbs {
  padding-bottom: 20px;
  .starUser-hbs-list {
    overflow: hidden;
    .starUser-hbs-item {
      margin-top: 24px;
      padding-left: 180px;
      position: relative;
      line-height: 56px;
      .starUser-hbs-name {
        width: 180px;
        position: absolute;
        left: 0;
      }
      .starUser-hbs-text {
        width: 100%;
        display: inline-block;
      }
      .starUser-hbs-radio {
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
      .starUser-hbs-code {
        text-indent: 28px;
        text-decoration: underline;
        button{
          background:none;
          border:none;
          text-decoration: underline;
          outline:none;
          &.disabled{
            background: #ccc;
            color: #fff;
          }
        }
      }
    }
  }
}

</style>
